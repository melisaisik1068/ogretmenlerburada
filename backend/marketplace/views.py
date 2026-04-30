import os

from django.http import FileResponse
from django.utils.encoding import iri_to_uri
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsVerifiedTeacher

from .models import Material, MaterialAccess, Order, OrderItem, OrderStatus
from .serializers import MaterialSerializer, OrderSerializer


class MaterialViewSet(viewsets.ModelViewSet):
    serializer_class = MaterialSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsVerifiedTeacher()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Material.objects.select_related("seller").order_by("-created_at")
        if self.action in ["list", "retrieve"]:
            return qs.filter(is_published=True)
        return qs.filter(seller=self.request.user)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def download(self, request, pk=None):
        # IMPORTANT: allow buyers to download too (not only seller queryset)
        m = Material.objects.select_related("seller").filter(id=pk, is_published=True).first()
        if m is None:
            return Response({"detail": "Material not found."}, status=404)

        u = request.user
        has_access = False
        if m.seller_id == u.id:
            has_access = True
        elif m.price_try <= 0:
            has_access = True
        elif MaterialAccess.objects.filter(material=m, user=u).exists():
            has_access = True

        if not has_access:
            return Response({"detail": "Access denied."}, status=403)

        if not m.file:
            return Response({"detail": "File missing."}, status=404)

        filename = os.path.basename(getattr(m.file, "name", "") or "") or f"material-{m.id}"
        resp = FileResponse(m.file.open("rb"), as_attachment=True, filename=filename)
        resp["Content-Type"] = "application/octet-stream"
        resp["Content-Disposition"] = f"attachment; filename*=UTF-8''{iri_to_uri(filename)}"
        return resp


class MaterialCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        material_id = request.data.get("material_id")
        try:
            mid = int(material_id)
        except Exception:
            return Response({"detail": "material_id invalid."}, status=400)

        m = Material.objects.filter(id=mid, is_published=True).select_related("seller").first()
        if m is None:
            return Response({"detail": "Material not found."}, status=404)

        # If already has access, avoid charging again (still return ok)
        if MaterialAccess.objects.filter(material=m, user=request.user).exists():
            return Response({"ok": True, "already_owned": True})

        stripe_key = os.getenv("STRIPE_SECRET_KEY", "").strip()
        if not stripe_key:
            return Response({"detail": "STRIPE_SECRET_KEY eksik."}, status=500)

        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
        success_url = f"{frontend_url}/shop/{m.id}?checkout=success"
        cancel_url = f"{frontend_url}/shop/{m.id}?checkout=cancel"

        import stripe

        stripe.api_key = stripe_key
        # TRY amounts are in kurus
        unit_amount = int(max(0, m.price_try)) * 100
        if unit_amount <= 0:
            # Free material: grant access immediately
            MaterialAccess.objects.get_or_create(material=m, user=request.user)
            return Response({"ok": True, "free": True})

        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=[
                {
                    "price_data": {
                        "currency": "try",
                        "product_data": {"name": m.title, "metadata": {"material_id": str(m.id)}},
                        "unit_amount": unit_amount,
                    },
                    "quantity": 1,
                }
            ],
            success_url=success_url,
            cancel_url=cancel_url,
            customer_email=getattr(request.user, "email", "") or None,
            client_reference_id=str(getattr(request.user, "id", "")),
            metadata={"material_id": str(m.id), "user_id": str(getattr(request.user, "id", ""))},
        )

        Order.objects.create(
            buyer=request.user,
            status=OrderStatus.PENDING,
            total_try=int(max(0, m.price_try)),
            provider="stripe",
            provider_payment_id=str(session.id),
        )

        return Response({"ok": True, "checkout_url": session.url, "session_id": session.id})


class StripeShopWebhookView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        stripe_key = os.getenv("STRIPE_SECRET_KEY", "").strip()
        webhook_secrets = [
            os.getenv("STRIPE_WEBHOOK_SECRET", "").strip(),
            os.getenv("STRIPE_WEBHOOK_SECRET_SHOP", "").strip(),
        ]
        webhook_secrets = [s for s in webhook_secrets if s]
        if not stripe_key or not webhook_secrets:
            return Response({"detail": "Stripe webhook not configured."}, status=500)

        payload = request.body
        sig = request.headers.get("Stripe-Signature", "")

        import stripe

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

        if etype == "checkout.session.completed":
            # For payments
            if obj.get("mode") != "payment":
                return Response({"ok": True})

            user_id = str((obj.get("metadata") or {}).get("user_id") or obj.get("client_reference_id") or "").strip()
            material_id = str((obj.get("metadata") or {}).get("material_id") or "").strip()
            session_id = str(obj.get("id") or "").strip()
            payment_intent = str(obj.get("payment_intent") or "").strip()

            if user_id and material_id and session_id:
                try:
                    uid = int(user_id)
                    mid = int(material_id)
                except Exception:
                    return Response({"ok": True})

                m = Material.objects.filter(id=mid).first()
                if m is None:
                    return Response({"ok": True})

                # Mark order paid (idempotent)
                order, _created = Order.objects.update_or_create(
                    provider="stripe",
                    provider_payment_id=session_id,
                    defaults={
                        "buyer_id": uid,
                        "status": OrderStatus.PAID,
                        "total_try": int(max(0, m.price_try)),
                    },
                )
                if _created:
                    OrderItem.objects.create(order=order, material=m, unit_price_try=int(max(0, m.price_try)))
                else:
                    # Ensure item exists
                    OrderItem.objects.get_or_create(
                        order=order,
                        material=m,
                        defaults={"unit_price_try": int(max(0, m.price_try))},
                    )

                MaterialAccess.objects.get_or_create(material=m, user_id=uid)

                # best effort: store payment_intent (if we used session id earlier)
                if payment_intent and order.provider_payment_id != payment_intent:
                    # keep session id; optionally extend model later
                    pass

        return Response({"ok": True})


class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Order.objects.filter(buyer=request.user)
            .prefetch_related("items", "items__material", "items__material__seller")
            .order_by("-created_at")
        )
        # simple pagination (page/page_size) aligned with DRF pagination style
        try:
            page = int(request.query_params.get("page") or "1")
        except Exception:
            page = 1
        page = max(1, page)
        try:
            page_size = int(request.query_params.get("page_size") or "12")
        except Exception:
            page_size = 12
        page_size = max(1, min(60, page_size))
        total = qs.count()
        start = (page - 1) * page_size
        end = start + page_size
        items = list(qs[start:end])
        data = OrderSerializer(items, many=True, context={"request": request}).data
        next_url = None
        prev_url = None
        if end < total:
            next_url = f"?page={page + 1}&page_size={page_size}"
        if page > 1:
            prev_url = f"?page={page - 1}&page_size={page_size}"
        return Response({"count": total, "next": next_url, "previous": prev_url, "results": data})
