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
