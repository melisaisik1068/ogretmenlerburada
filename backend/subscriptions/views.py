import os

from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PaymentProvider, Subscription, SubscriptionPlan, SubscriptionStatus
from .serializers import SubscriptionPlanSerializer, SubscriptionSerializer


class PlanListView(generics.ListAPIView):
    serializer_class = SubscriptionPlanSerializer

    def get_queryset(self):
        return SubscriptionPlan.objects.filter(is_active=True).order_by("price_try")


class MySubscriptionView(APIView):
    """Abonelik yokken 200 + plan=null döner (middleware / frontend için güvenli)."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        sub = (
            Subscription.objects.filter(user=request.user)
            .select_related("plan")
            .order_by("-created_at")
            .first()
        )
        if sub is None:
            return Response({"subscription": None, "plan": None})
        return Response(SubscriptionSerializer(sub).data)


class CheckoutView(APIView):
    """Stripe Checkout Session oluşturur ve URL döner.

    Not: Plan'da stripe_price_id tanımlı olmalı.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan_code = (request.data.get("plan") or "").strip()
        if not plan_code:
            return Response({"detail": "plan gerekli."}, status=400)

        plan = SubscriptionPlan.objects.filter(is_active=True, code=plan_code).first()
        if plan is None:
            return Response({"detail": "Plan bulunamadı."}, status=404)
        if not plan.stripe_price_id:
            return Response({"detail": "Plan için Stripe price id tanımlı değil."}, status=400)

        stripe_key = os.getenv("STRIPE_SECRET_KEY", "").strip()
        if not stripe_key:
            return Response({"detail": "STRIPE_SECRET_KEY eksik."}, status=500)

        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
        success_url = f"{frontend_url}/dashboard?checkout=success"
        cancel_url = f"{frontend_url}/upgrade?checkout=cancel"

        import stripe  # local import: optional dependency

        stripe.api_key = stripe_key

        session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[{"price": plan.stripe_price_id, "quantity": 1}],
            success_url=success_url,
            cancel_url=cancel_url,
            customer_email=getattr(request.user, "email", "") or None,
            client_reference_id=str(getattr(request.user, "id", "")),
            metadata={"plan_code": plan.code, "user_id": str(getattr(request.user, "id", ""))},
            allow_promotion_codes=True,
        )

        # Aboneliği "incomplete" olarak kaydet (webhook ile active olacak)
        Subscription.objects.create(
            user=request.user,
            plan=plan,
            provider=PaymentProvider.STRIPE,
            status=SubscriptionStatus.INCOMPLETE,
        )

        return Response({"ok": True, "checkout_url": session.url, "session_id": session.id})


class ManageSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        action = (request.data.get("action") or "").strip().lower()
        if action not in ("cancel", "resume"):
            return Response({"detail": "action must be cancel|resume"}, status=400)

        sub = (
            Subscription.objects.filter(user=request.user, provider=PaymentProvider.STRIPE)
            .select_related("plan")
            .order_by("-created_at")
            .first()
        )
        if sub is None or not sub.provider_subscription_id:
            return Response({"detail": "Stripe subscription not found."}, status=404)

        stripe_key = os.getenv("STRIPE_SECRET_KEY", "").strip()
        if not stripe_key:
            return Response({"detail": "STRIPE_SECRET_KEY eksik."}, status=500)

        import stripe

        stripe.api_key = stripe_key
        try:
            updated = stripe.Subscription.modify(
                sub.provider_subscription_id,
                cancel_at_period_end=True if action == "cancel" else False,
            )
        except Exception:
            return Response({"detail": "Stripe update failed."}, status=502)

        status = updated.get("status") or sub.status
        cps = updated.get("current_period_start")
        cpe = updated.get("current_period_end")
        sub.status = SubscriptionStatus.ACTIVE if status in ("active", "trialing") else sub.status
        sub.cancel_at_period_end = bool(updated.get("cancel_at_period_end"))
        sub.current_period_start = timezone.datetime.fromtimestamp(cps, tz=timezone.utc) if cps else sub.current_period_start
        sub.current_period_end = timezone.datetime.fromtimestamp(cpe, tz=timezone.utc) if cpe else sub.current_period_end
        sub.save(update_fields=["status", "cancel_at_period_end", "current_period_start", "current_period_end", "updated_at"])

        return Response({"ok": True, "subscription": SubscriptionSerializer(sub).data})


class StripeWebhookView(APIView):
    """Stripe webhook: checkout completion -> subscription activate."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        stripe_key = os.getenv("STRIPE_SECRET_KEY", "").strip()
        webhook_secrets = [
            os.getenv("STRIPE_WEBHOOK_SECRET", "").strip(),
            os.getenv("STRIPE_WEBHOOK_SECRET_SUBSCRIPTIONS", "").strip(),
        ]
        webhook_secrets = [s for s in webhook_secrets if s]
        if not stripe_key or not webhook_secrets:
            return Response({"detail": "Stripe webhook not configured."}, status=500)

        payload = request.body
        sig = request.headers.get("Stripe-Signature", "")

        import stripe  # local import

        stripe.api_key = stripe_key
        event = None
        for secret in webhook_secrets:
            try:
                event = stripe.Webhook.construct_event(payload=payload, sig_header=sig, secret=secret)
                break
            except Exception:
                event = None
        if event is None:
            return Response({"detail": "Invalid signature."}, status=400)

        etype = event.get("type")
        obj = (event.get("data") or {}).get("object") or {}

        def _map_stripe_status(status: str) -> str:
            s = (status or "").strip()
            if s in ("active", "trialing"):
                return SubscriptionStatus.ACTIVE
            if s in ("past_due", "unpaid"):
                return SubscriptionStatus.PAST_DUE
            if s in ("canceled", "incomplete_expired"):
                return SubscriptionStatus.CANCELED
            if s in ("incomplete",):
                return SubscriptionStatus.INCOMPLETE
            return SubscriptionStatus.INCOMPLETE

        def _plan_from_subscription_object(sub_obj: dict):
            # Try map from price id (recommended)
            price_id = (
                (((sub_obj.get("items") or {}).get("data") or [{}])[0].get("price") or {}).get("id")
                if isinstance(sub_obj.get("items"), dict)
                else None
            )
            if price_id:
                plan = SubscriptionPlan.objects.filter(stripe_price_id=price_id).first()
                if plan:
                    return plan
            # Fallback to metadata
            plan_code = str((sub_obj.get("metadata") or {}).get("plan_code") or "").strip()
            if plan_code:
                return SubscriptionPlan.objects.filter(code=plan_code).first()
            return None

        def _upsert_from_subscription(sub_obj: dict, user_id_hint: str | None = None):
            stripe_subscription_id = str(sub_obj.get("id") or "").strip()
            if not stripe_subscription_id:
                return
            stripe_customer_id = str(sub_obj.get("customer") or "").strip()
            status = sub_obj.get("status") or ""
            cps = sub_obj.get("current_period_start")
            cpe = sub_obj.get("current_period_end")
            cancel_at_period_end = bool(sub_obj.get("cancel_at_period_end"))

            plan = _plan_from_subscription_object(sub_obj)
            if plan is None:
                return

            # Find local subscription: prefer provider_subscription_id, otherwise use user hint latest
            existing = Subscription.objects.filter(
                provider=PaymentProvider.STRIPE, provider_subscription_id=stripe_subscription_id
            ).first()
            if existing is not None:
                uid = existing.user_id
            else:
                uid = None
                if user_id_hint and user_id_hint.isdigit():
                    uid = int(user_id_hint)

            if uid is None:
                return

            Subscription.objects.update_or_create(
                provider=PaymentProvider.STRIPE,
                provider_subscription_id=stripe_subscription_id,
                defaults={
                    "user_id": uid,
                    "plan": plan,
                    "provider_customer_id": stripe_customer_id,
                    "status": _map_stripe_status(str(status)),
                    "current_period_start": timezone.datetime.fromtimestamp(cps, tz=timezone.utc) if cps else None,
                    "current_period_end": timezone.datetime.fromtimestamp(cpe, tz=timezone.utc) if cpe else None,
                    "cancel_at_period_end": cancel_at_period_end,
                },
            )

        if etype == "checkout.session.completed":
            # Pull details from session + fetch subscription object
            user_id = str((obj.get("metadata") or {}).get("user_id") or obj.get("client_reference_id") or "").strip()
            stripe_subscription_id = str(obj.get("subscription") or "").strip()
            if user_id and stripe_subscription_id:
                try:
                    sub_remote = stripe.Subscription.retrieve(stripe_subscription_id)
                    _upsert_from_subscription(sub_remote, user_id_hint=user_id)
                except Exception:
                    pass

        elif etype in ("customer.subscription.updated", "customer.subscription.deleted"):
            # Event object is the subscription itself.
            sub_obj = obj
            user_id = str((sub_obj.get("metadata") or {}).get("user_id") or "").strip()
            if etype == "customer.subscription.deleted":
                # Ensure status becomes canceled
                sub_obj = {**sub_obj, "status": "canceled"}
            _upsert_from_subscription(sub_obj, user_id_hint=user_id)

        return Response({"ok": True})
