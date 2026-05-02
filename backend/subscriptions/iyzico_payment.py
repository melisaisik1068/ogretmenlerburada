import uuid
from datetime import timedelta
from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from config.iyzico_helpers import billing_address_simple, buyer_payload_from_user, public_api_root
from config.iyzico_api import checkout_form_initialize, checkout_form_retrieve, iyzico_configured
from config.notify import notify_subscription_started

from .models import PaymentProvider, Subscription, SubscriptionPlan, SubscriptionStatus


class SubscriptionCheckoutIyzicoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not iyzico_configured():
            return Response({"detail": "İyzico yapılandırılmadı."}, status=501)
        api_root = public_api_root()
        if not api_root:
            return Response({"detail": "API_PUBLIC_URL tanımlı değil."}, status=500)

        plan_code = (request.data.get("plan") or "").strip()
        if not plan_code:
            return Response({"detail": "plan gerekli."}, status=400)
        plan = SubscriptionPlan.objects.filter(is_active=True, code=plan_code).first()
        if plan is None:
            return Response({"detail": "Plan bulunamadı."}, status=404)
        price = int(max(0, plan.price_try))
        if price <= 0:
            return Response({"detail": "Plan fiyatı 0 olamaz (İyzico tek sefer)."}, status=400)

        user = request.user
        conv_id = f"sub{user.pk}x{plan.pk}x{uuid.uuid4().hex}"
        basket_id = f"B-sub-{plan.pk}-{uuid.uuid4().hex[:8]}"
        callback = f"{api_root}/api/subscriptions/iyzico/callback/"

        buyer = buyer_payload_from_user(user)
        basket_items = [
            {
                "id": f"P{plan.pk}",
                "name": (plan.title[:100] or "Plan"),
                "category1": "Membership",
                "itemType": "VIRTUAL",
                "price": Decimal(price).quantize(Decimal("0.01")).__format__("f"),
            }
        ]

        try:
            resp = checkout_form_initialize(
                locale="tr",
                conversation_id=conv_id,
                price_try=Decimal(price),
                basket_id=basket_id,
                callback_url_full=callback,
                buyer=buyer,
                billing_address=billing_address_simple(f"{buyer['name']} {buyer['surname']}"),
                basket_items=basket_items,
            )
        except Exception:
            return Response({"detail": "İyzico başlatılamadı."}, status=502)

        if resp.get("status") != "success":
            return Response({"detail": resp.get("errorMessage") or "İyzico reddetti."}, status=400)

        token = str(resp.get("token") or "")
        payment_page = str(resp.get("paymentPageUrl") or "")
        if not token or not payment_page:
            return Response({"detail": "İyzico yanıtı eksik."}, status=502)

        with transaction.atomic():
            Subscription.objects.create(
                user=user,
                plan=plan,
                provider=PaymentProvider.IYZICO,
                status=SubscriptionStatus.INCOMPLETE,
                provider_subscription_id=conv_id[:118],
                provider_customer_id=token[:118],
            )

        return Response({"ok": True, "payment_page_url": payment_page, "token": token, "conversation_id": conv_id})


@method_decorator(csrf_exempt, name="dispatch")
class SubscriptionIyzicoCallbackView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        return self._handle(request)

    def get(self, request):
        return self._handle(request)

    def _handle(self, request):
        if not iyzico_configured():
            return Response({"detail": "İyzico yapılandırılmadı."}, status=501)

        token = (request.POST.get("token") or request.data.get("token") or request.GET.get("token") or "").strip()
        conv = (
            request.POST.get("conversationId") or request.data.get("conversationId") or request.GET.get("conversationId") or ""
        ).strip()

        if not token:
            return Response({"detail": "token yok."}, status=400)

        try:
            resp = checkout_form_retrieve(locale="tr", conversation_id=conv or token, token=token)
        except Exception:
            return Response({"detail": "İyzico doğrulama başarısız."}, status=502)

        if resp.get("status") != "success" or str(resp.get("paymentStatus") or "").lower() != "success":
            return Response({"ok": False}, status=200)

        payment_id = str(resp.get("paymentId") or "").strip()[:118]
        cid = str(resp.get("conversationId") or conv or "")
        uid = pid = None
        if cid.startswith("sub"):
            inner = cid[3:]
            if inner.count("x") >= 2:
                parts = inner.split("x")
                try:
                    uid = int(parts[0])
                    pid = int(parts[1])
                except Exception:
                    uid = pid = None

        if uid is None or pid is None:
            return Response({"ok": True}, status=200)

        from django.contrib.auth import get_user_model

        User = get_user_model()
        u = User.objects.filter(id=uid).first()
        plan = SubscriptionPlan.objects.filter(pk=pid).first()
        if u is None or plan is None:
            return Response({"ok": True}, status=200)

        token_key = token[:118]
        sub_row = (
            Subscription.objects.filter(
                user=u,
                plan=plan,
                provider=PaymentProvider.IYZICO,
                status=SubscriptionStatus.INCOMPLETE,
            )
            .filter(provider_customer_id__in=[token_key, token])
            .order_by("-pk")
            .first()
        )
        if sub_row is None:
            sub_row = (
                Subscription.objects.filter(user=u, plan=plan, provider=PaymentProvider.IYZICO)
                .order_by("-pk")
                .first()
            )

        period_days = max(1, int(plan.billing_cycle_days or 30))
        now = timezone.now()
        end = now + timedelta(days=period_days)

        if sub_row is None:
            Subscription.objects.create(
                user=u,
                plan=plan,
                provider=PaymentProvider.IYZICO,
                status=SubscriptionStatus.ACTIVE,
                provider_subscription_id=(payment_id or token_key)[:118],
                provider_customer_id=token_key,
                current_period_start=now,
                current_period_end=end,
            )
        else:
            sub_row.provider_subscription_id = (payment_id or token_key)[:118]
            sub_row.provider_customer_id = token_key
            sub_row.status = SubscriptionStatus.ACTIVE
            sub_row.current_period_start = now
            sub_row.current_period_end = end
            sub_row.save(
                update_fields=[
                    "provider_subscription_id",
                    "provider_customer_id",
                    "status",
                    "current_period_start",
                    "current_period_end",
                    "updated_at",
                ]
            )

        notify_subscription_started(getattr(u, "email", None), plan_title=plan.title)
        return Response({"ok": True}, status=200)
