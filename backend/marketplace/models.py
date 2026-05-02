from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class MaterialType(models.TextChoices):
    PDF = "pdf", "PDF"
    VIDEO = "video", "Video"
    OTHER = "other", "Diğer"


class Material(models.Model):
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="materials",
        verbose_name=_("Satıcı"),
        help_text=_("Materyali yayımlayan kullanıcı (genelde öğretmen)."),
    )
    title = models.CharField(_("Başlık"), max_length=160)
    description = models.TextField(_("Açıklama"), blank=True, default="", help_text=_("Liste ve detay sayfasında görünen kısa açıklama."))

    type = models.CharField(
        _("Tür"),
        max_length=20,
        choices=MaterialType.choices,
        default=MaterialType.PDF,
        help_text=_("Dosya içerik tipi (PDF, video vb.)."),
    )
    file = models.FileField(
        _("Dosya"),
        upload_to="materials/%Y/%m/",
        help_text=_("Satın alma sonrası indirilecek asıl dosya."),
    )

    price_try = models.PositiveIntegerField(
        _("Fiyat (₺)"),
        default=0,
        help_text=_("Türk Lirası cinsinden tam sayı tutar."),
    )
    is_published = models.BooleanField(
        _("Yayında"),
        default=False,
        help_text=_("İşaretli değilse mağazada görünmez."),
    )

    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Materyal")
        verbose_name_plural = _("Materyaller")

    def __str__(self) -> str:
        return self.title


class OrderStatus(models.TextChoices):
    PENDING = "pending", "Beklemede"
    PAID = "paid", "Ödendi"
    REFUNDED = "refunded", "İade"
    CANCELED = "canceled", "İptal"


class Order(models.Model):
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name=_("Alıcı"),
        help_text=_("Siparişi veren kullanıcı."),
    )
    status = models.CharField(
        _("Durum"),
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        help_text=_("Ödeme ve teslim sürecinin anlık durumu."),
    )
    total_try = models.PositiveIntegerField(
        _("Toplam (₺)"),
        default=0,
        help_text=_("Siparişteki kalemlerin toplamı (Türk Lirası, tam sayı)."),
    )

    provider = models.CharField(
        _("Ödeme sağlayıcısı"),
        max_length=20,
        default="",
        help_text=_("Örn. stripe veya iyzico — webhook ve mutabakat için."),
    )
    provider_payment_id = models.CharField(
        _("Sağlayıcı ödeme kimliği"),
        max_length=120,
        blank=True,
        default="",
        help_text=_("Ödeme sağlayıcısından dönen benzersiz işlem kodu."),
    )

    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)

    class Meta:
        verbose_name = _("Sipariş")
        verbose_name_plural = _("Siparişler")


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name=_("Sipariş"),
    )
    material = models.ForeignKey(
        Material,
        on_delete=models.PROTECT,
        related_name="order_items",
        verbose_name=_("Materyal"),
    )
    unit_price_try = models.PositiveIntegerField(
        _("Birim fiyat (₺)"),
        help_text=_("Satır bazında materyalin o anki Türk Lirası fiyatı."),
    )

    class Meta:
        verbose_name = _("Sipariş kalemi")
        verbose_name_plural = _("Sipariş kalemleri")


class MaterialAccess(models.Model):
    material = models.ForeignKey(
        Material,
        on_delete=models.CASCADE,
        related_name="accesses",
        verbose_name=_("Materyal"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="material_accesses",
        verbose_name=_("Kullanıcı"),
        help_text=_("Erişim verilen alıcı veya tanımlanan kullanıcı."),
    )
    granted_at = models.DateTimeField(_("Verilme zamanı"), auto_now_add=True)

    class Meta:
        verbose_name = _("Materyal erişimi")
        verbose_name_plural = _("Materyal erişimleri")
        constraints = [
            models.UniqueConstraint(
                fields=("material", "user"),
                name="marketplace_materialaccess_material_user_uniq",
            ),
        ]


class SellerPayout(models.Model):
    """Öğretmenlere manuel/havale ödeme kaydı (otomatik banka entegrasyonu yok)."""

    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seller_payouts",
        verbose_name=_("Satıcı"),
    )
    paid_at = models.DateTimeField(_("Ödeme tarihi"), auto_now_add=True)
    total_net_try = models.PositiveIntegerField(
        _("Toplam net (₺)"),
        default=0,
        help_text=_("Bu ödemede kullanıcıya iletilen toplam net tutar."),
    )
    reference_note = models.TextField(
        _("Referans notu"),
        blank=True,
        default="",
        help_text=_("Dekont no, havale açıklaması veya iç not."),
    )

    class Meta:
        ordering = ["-paid_at"]
        verbose_name = _("Satıcı ödemesi")
        verbose_name_plural = _("Satıcı ödemeleri")


class SellerEarning(models.Model):
    """Satıcı payı: brüt satış – platform komisyonu = net (havale ile kapatılır)."""

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="seller_earnings",
        verbose_name=_("Sipariş"),
    )
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seller_earnings",
        verbose_name=_("Satıcı"),
    )
    material = models.ForeignKey(
        Material,
        on_delete=models.PROTECT,
        related_name="seller_earnings",
        verbose_name=_("Materyal"),
    )
    gross_try = models.PositiveIntegerField(
        _("Brüt (₺)"),
        help_text=_("Satış tutarı, komisyon düşülmeden önce."),
    )
    commission_try = models.PositiveIntegerField(
        _("Komisyon (₺)"),
        help_text=_("Platform payı olarak kesilen Türk Lirası tutarı."),
    )
    net_try = models.PositiveIntegerField(
        _("Net (₺)"),
        help_text=_("Satıcıya düşecek Türk Lirası tutarı (brüt − komisyon)."),
    )
    payout = models.ForeignKey(
        SellerPayout,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="earnings",
        verbose_name=_("Ödeme kaydı"),
        help_text=_("Bu hakedişin hangi toplu ödemeye dahil olduğu."),
    )
    created_at = models.DateTimeField(_("Kayıt zamanı"), auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Satıcı hakedişi")
        verbose_name_plural = _("Satıcı hakedişleri")
        constraints = [
            models.UniqueConstraint(fields=["order", "material"], name="uniq_seller_earning_order_material"),
        ]
