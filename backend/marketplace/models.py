from django.conf import settings
from django.db import models


class MaterialType(models.TextChoices):
    PDF = "pdf", "PDF"
    VIDEO = "video", "Video"
    OTHER = "other", "Diğer"


class Material(models.Model):
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="materials")
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True, default="")

    type = models.CharField(max_length=20, choices=MaterialType.choices, default=MaterialType.PDF)
    file = models.FileField(upload_to="materials/%Y/%m/")

    price_try = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class OrderStatus(models.TextChoices):
    PENDING = "pending", "Beklemede"
    PAID = "paid", "Ödendi"
    REFUNDED = "refunded", "İade"
    CANCELED = "canceled", "İptal"


class Order(models.Model):
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    total_try = models.PositiveIntegerField(default=0)

    provider = models.CharField(max_length=20, default="")  # stripe / iyzico
    provider_payment_id = models.CharField(max_length=120, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    material = models.ForeignKey(Material, on_delete=models.PROTECT, related_name="order_items")
    unit_price_try = models.PositiveIntegerField()


class MaterialAccess(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name="accesses")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="material_accesses")
    granted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [("material", "user")]


class SellerPayout(models.Model):
    """Öğretmenlere manuel/havale ödeme kaydı (otomatik banka entegrasyonu yok)."""

    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="seller_payouts")
    paid_at = models.DateTimeField(auto_now_add=True)
    total_net_try = models.PositiveIntegerField(default=0, help_text="Bu ödemede yer alan net tutar (₺).")
    reference_note = models.TextField(blank=True, default="", help_text="Dekont/havale referansı vb.")

    class Meta:
        ordering = ["-paid_at"]


class SellerEarning(models.Model):
    """Satıcı payı: brüt satış – platform komisyonu = net (havale ile kapatılır)."""

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="seller_earnings")
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="seller_earnings")
    material = models.ForeignKey(Material, on_delete=models.PROTECT, related_name="seller_earnings")
    gross_try = models.PositiveIntegerField()
    commission_try = models.PositiveIntegerField()
    net_try = models.PositiveIntegerField()
    payout = models.ForeignKey(SellerPayout, null=True, blank=True, on_delete=models.SET_NULL, related_name="earnings")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["order", "material"], name="uniq_seller_earning_order_material"),
        ]
