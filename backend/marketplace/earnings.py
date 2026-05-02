from django.conf import settings

from .models import Order, OrderStatus, SellerEarning


def record_seller_earnings_for_paid_order(order: Order) -> None:
    """Ödeme tamamlanan sipariş için satıcı hakediş kayıtları (idempotent)."""

    if order.status != OrderStatus.PAID:
        return
    pct = max(0, min(100, getattr(settings, "MARKETPLACE_COMMISSION_PERCENT", 15)))
    for item in order.items.select_related("material", "material__seller"):
        seller = item.material.seller
        gross = int(max(0, item.unit_price_try))
        commission_try = (gross * pct) // 100
        net_try = max(0, gross - commission_try)
        SellerEarning.objects.get_or_create(
            order=order,
            material=item.material,
            defaults={
                "seller": seller,
                "gross_try": gross,
                "commission_try": commission_try,
                "net_try": net_try,
            },
        )
