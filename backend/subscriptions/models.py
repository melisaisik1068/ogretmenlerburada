from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


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
    code = models.CharField(
        _("Plan kodu"),
        max_length=20,
        choices=SubscriptionPlanCode.choices,
        unique=True,
        help_text=_("Sistem içi benzersiz kısa kod (stripe/iyzico eşlemesi için)."),
    )
    title = models.CharField(_("Görünen ad"), max_length=50)
    price_try = models.PositiveIntegerField(
        _("Liste fiyatı (₺)"),
        help_text=_("Aylık veya dönem fiyat gösterimi için tam sayı tutar."),
    )
    billing_cycle_days = models.PositiveSmallIntegerField(
        _("Faturalama döngüsü (gün)"),
        default=30,
        help_text=_("Tek sefer ödeme ile dönem uzunluğu (örn. 30 gün erişim)."),
    )
    is_active = models.BooleanField(_("Aktif satış"), default=True, help_text=_("Pasif planlar seçim ekranında çıkmaz."))

    stripe_price_id = models.CharField(
        _("Stripe Price ID"),
        max_length=120,
        blank=True,
        default="",
        help_text=_("Stripe Dashboard’dan kopyalanan price id."),
    )
    iyzico_plan_reference = models.CharField(
        _("İyzico plan referansı"),
        max_length=120,
        blank=True,
        default="",
        help_text=_("İyzico tekrarlı ödemeler için iç referans kodu."),
    )

    class Meta:
        verbose_name = _("Abonelik planı")
        verbose_name_plural = _("Abonelik planları")

    def __str__(self) -> str:
        return f"{self.title} ({self.price_try}₺)"


class Subscription(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscriptions",
        verbose_name=_("Kullanıcı"),
    )
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        related_name="subscriptions",
        verbose_name=_("Plan"),
    )

    provider = models.CharField(
        _("Ödeme sağlayıcısı"),
        max_length=20,
        choices=PaymentProvider.choices,
        default=PaymentProvider.MANUAL,
        help_text=_("Aboneliği hangi sağlayıcının yönettiği."),
    )
    provider_customer_id = models.CharField(
        _("Müşteri kimliği (sağlayıcı)"),
        max_length=120,
        blank=True,
        default="",
        help_text=_("Örn. Stripe customer id."),
    )
    provider_subscription_id = models.CharField(
        _("Abonelik kimliği (sağlayıcı)"),
        max_length=120,
        blank=True,
        default="",
        help_text=_("Webhook ve iptal işlemlerinde gereken dış kimlik."),
    )

    status = models.CharField(
        _("Durum"),
        max_length=20,
        choices=SubscriptionStatus.choices,
        default=SubscriptionStatus.INCOMPLETE,
    )
    current_period_start = models.DateTimeField(_("Dönem başlangıcı"), null=True, blank=True)
    current_period_end = models.DateTimeField(_("Dönem bitişi"), null=True, blank=True)
    cancel_at_period_end = models.BooleanField(
        _("Dönem sonunda iptal"),
        default=False,
        help_text=_("İşaretliyse süre dolunca yenilenmez."),
    )

    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Güncellenme"), auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Abonelik")
        verbose_name_plural = _("Abonelikler")
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["provider", "provider_subscription_id"]),
        ]

    @property
    def is_active(self) -> bool:
        return self.status == SubscriptionStatus.ACTIVE and (
            self.current_period_end is None or self.current_period_end > timezone.now()
        )
