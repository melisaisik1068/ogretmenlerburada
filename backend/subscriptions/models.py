from django.conf import settings
from django.db import models
from django.utils import timezone


class SubscriptionPlanCode(models.TextChoices):
    BASIC = "basic", "Temel"
    PRO = "pro", "Pro"
    ENTERPRISE = "enterprise", "Kurumsal"


class PaymentProvider(models.TextChoices):
    STRIPE = "stripe", "Stripe"
    IYZICO = "iyzico", "iyzico"
    MANUAL = "manual", "Manuel"


class SubscriptionStatus(models.TextChoices):
    ACTIVE = "active", "Aktif"
    INCOMPLETE = "incomplete", "Eksik"
    PAST_DUE = "past_due", "Ödeme Gecikmiş"
    CANCELED = "canceled", "İptal"
    EXPIRED = "expired", "Süresi Doldu"


class SubscriptionPlan(models.Model):
    code = models.CharField(max_length=20, choices=SubscriptionPlanCode.choices, unique=True)
    title = models.CharField(max_length=50)
    price_try = models.PositiveIntegerField(help_text="Aylık ücret (₺) - gösterim amaçlı.")
    billing_cycle_days = models.PositiveSmallIntegerField(
        default=30,
        help_text="İyzico/tekrarlayan olmayan tek sefer ödemede bir dönem süresi (gün).",
    )
    is_active = models.BooleanField(default=True)

    # Provider ready: mapping
    stripe_price_id = models.CharField(max_length=120, blank=True, default="")
    iyzico_plan_reference = models.CharField(max_length=120, blank=True, default="")

    class Meta:
        verbose_name = "Abonelik planı"
        verbose_name_plural = "Abonelik planları"

    def __str__(self) -> str:
        return f"{self.title} ({self.price_try}₺)"


class Subscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subscriptions")
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT, related_name="subscriptions")

    provider = models.CharField(max_length=20, choices=PaymentProvider.choices, default=PaymentProvider.MANUAL)
    provider_customer_id = models.CharField(max_length=120, blank=True, default="")
    provider_subscription_id = models.CharField(max_length=120, blank=True, default="")

    status = models.CharField(max_length=20, choices=SubscriptionStatus.choices, default=SubscriptionStatus.INCOMPLETE)
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Abonelik"
        verbose_name_plural = "Abonelikler"
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["provider", "provider_subscription_id"]),
        ]

    @property
    def is_active(self) -> bool:
        return self.status == SubscriptionStatus.ACTIVE and (
            self.current_period_end is None or self.current_period_end > timezone.now()
        )
