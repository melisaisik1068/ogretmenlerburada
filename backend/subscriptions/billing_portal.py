import os

import stripe
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.conf import settings

from .models import PaymentProvider, Subscription


class BillingPortalView(APIView):
    """Stripe Billing Portal (kart / fatura) — müşteri portalı oturumu."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        sk = os.getenv("STRIPE_SECRET_KEY", "").strip()
        if not sk:
            return Response({"detail": "STRIPE_SECRET_KEY eksik."}, status=500)

        sub = (
            Subscription.objects.filter(user=request.user, provider=PaymentProvider.STRIPE)
            .order_by("-updated_at", "-pk")
            .first()
        )

        stripe.api_key = sk
        customer_id = (sub.provider_customer_id if sub else "") or ""

        if not customer_id:
            # Checkout'ta otomatik oluşan müşteri: e-posta ile arama
            try:
                lst = stripe.Customer.list(email=(request.user.email or "")[:256], limit=1)
                if lst and getattr(lst, "data", None):
                    customer_id = lst.data[0].id
            except Exception:
                customer_id = ""

        if not customer_id:
            try:
                cus = stripe.Customer.create(
                    email=(request.user.email or None),
                    metadata={"user_id": str(request.user.pk)},
                )
                customer_id = cus.id
                if sub:
                    sub.provider_customer_id = customer_id
                    sub.save(update_fields=["provider_customer_id", "updated_at"])
            except Exception:
                return Response({"detail": "Stripe müşteri oluşturulamadı."}, status=502)

        return_url = f"{settings.FRONTEND_PUBLIC_URL.rstrip('/')}/dashboard/subscription"

        try:
            session = stripe.billing_portal.Session.create(customer=customer_id, return_url=return_url)
        except Exception:
            return Response({"detail": "Billing portal açılamadı (Stripe müşteri bağlı mı?)."}, status=502)

        return Response({"ok": True, "url": session.url})
