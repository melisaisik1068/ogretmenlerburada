import uuid
from decimal import Decimal

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from config.iyzico_helpers import billing_address_simple, buyer_payload_from_user, public_api_root
from config.iyzico_api import checkout_form_initialize, checkout_form_retrieve, iyzico_configured

from .earnings import record_seller_earnings_for_paid_order
from .models import Material, MaterialAccess, Order, OrderItem, OrderStatus
from config.notify import notify_shop_purchase


class MaterialCheckoutIyzicoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not iyzico_configured():
            return Response({"detail": "İyzico yapılandırılmadı."}, status=501)
        api_root = public_api_root()
        if not api_root:
            return Response({"detail": "API_PUBLIC_URL tanımlı değil."}, status=500)

        material_id = request.data.get("material_id")
        try:
            mid = int(material_id)
        except Exception:
            return Response({"detail": "material_id invalid."}, status=400)

        m = Material.objects.filter(id=mid, is_published=True).select_related("seller").first()
        if m is None:
            return Response({"detail": "Material not found."}, status=404)
        if MaterialAccess.objects.filter(material=m, user=request.user).exists():
            return Response({"ok": True, "already_owned": True})

        price = int(max(0, m.price_try))
        if price <= 0:
            MaterialAccess.objects.get_or_create(material=m, user=request.user)
            return Response({"ok": True, "free": True})

        user = request.user
        # conversationId düz çizgisiz tek token (callback'te güvenilir parse)
        conv_id = f"mat{user.pk}x{m.pk}x{uuid.uuid4().hex}"
        basket_id = f"B-mat-{m.pk}-{uuid.uuid4().hex[:8]}"
        callback = f"{api_root}/api/marketplace/iyzico/callback/"

        buyer = buyer_payload_from_user(user)
        basket_items = [
            {
                "id": f"M{m.pk}",
                "name": (m.title[:100] or "Materyal"),
                "category1": "Education",
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
        if not token:
            return Response({"detail": "İyzico token yok."}, status=502)

        payment_page = str(resp.get("paymentPageUrl") or "")

        o = Order.objects.create(
            buyer=user,
            status=OrderStatus.PENDING,
            total_try=price,
            provider="iyzico",
            provider_payment_id=token[:118],
        )
        OrderItem.objects.create(order=o, material=m, unit_price_try=price)

        return Response({"ok": True, "payment_page_url": payment_page, "token": token, "conversation_id": conv_id})


@method_decorator(csrf_exempt, name="dispatch")
class MaterialIyzicoCallbackView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        return self._handle(request)

    def get(self, request):
        # Bazı entegrasyonlar token'ı query ile döndürebilir
        return self._handle(request)

    def _handle(self, request):
        if not iyzico_configured():
            return Response({"detail": "İyzico yapılandırılmadı."}, status=501)

        token = (request.POST.get("token") or request.data.get("token") or request.GET.get("token") or "").strip()
        if not token:
            return Response({"detail": "token yok."}, status=400)

        conv = (
            request.POST.get("conversationId") or request.data.get("conversationId") or request.GET.get("conversationId") or ""
        ).strip()

        try:
            resp = checkout_form_retrieve(locale="tr", conversation_id=conv or token, token=token)
        except Exception:
            return Response({"detail": "İyzico doğrulama başarısız."}, status=502)

        if resp.get("status") != "success":
            return Response({"ok": False}, status=200)

        if str(resp.get("paymentStatus") or "").lower() != "success":
            return Response({"ok": False, "paymentStatus": resp.get("paymentStatus")}, status=200)

        payment_id = str(resp.get("paymentId") or "").strip() or token
        basket_items = resp.get("itemTransactions") or resp.get("paymentItems") or []
        material_id = None
        if isinstance(basket_items, list) and basket_items:
            item_id = str((basket_items[0] or {}).get("itemId") or "").strip()
            if item_id.startswith("M") and item_id[1:].isdigit():
                material_id = int(item_id[1:])

        user_id = None
        cid = str(resp.get("conversationId") or conv or "")
        if cid.startswith("mat") and "x" in cid[3:]:
            try:
                rest = cid[3:]
                p1, tail = rest.split("x", 1)
                p2 = tail.split("x", 1)[0]
                user_id = int(p1)
                material_id = int(p2)
            except Exception:
                user_id = None

        if material_id is None or user_id is None:
            oid = None
            for o in Order.objects.filter(provider="iyzico").order_by("-created_at")[:30]:
                tok = (o.provider_payment_id or "").strip()
                if tok == token[: len(tok)] or tok == token:
                    oid = o
                    user_id = user_id or o.buyer_id
                    break
            if oid and material_id is None and oid.items.exists():
                material_id = oid.items.first().material_id

        if material_id is None or user_id is None:
            return Response({"ok": True}, status=200)

        from django.contrib.auth import get_user_model

        User = get_user_model()
        u = User.objects.filter(id=user_id).first()
        mat = Material.objects.filter(id=material_id).first()
        if u is None or mat is None:
            return Response({"ok": True}, status=200)

        token_key = token[:118] if len(token) >= 118 else token
        order = (
            Order.objects.filter(provider="iyzico", buyer=u, status=OrderStatus.PENDING, provider_payment_id__in=[token_key, token])
            .prefetch_related("items")
            .order_by("-pk")
            .first()
        )
        if order is None:
            order = (
                Order.objects.filter(provider="iyzico", buyer=u, status=OrderStatus.PENDING, items__material=mat)
                .order_by("-pk")
                .first()
            )
        if order is None:
            return Response({"ok": True}, status=200)

        order.status = OrderStatus.PAID
        order.provider_payment_id = payment_id[:118]
        order.total_try = int(max(0, mat.price_try))
        order.save(update_fields=["status", "provider_payment_id", "total_try"])

        OrderItem.objects.get_or_create(order=order, material=mat, defaults={"unit_price_try": int(max(0, mat.price_try))})

        MaterialAccess.objects.get_or_create(material=mat, user=u)

        record_seller_earnings_for_paid_order(order)
        notify_shop_purchase(getattr(u, "email", None), material_title=mat.title, amount_try=int(order.total_try))

        return Response({"ok": True}, status=200)
