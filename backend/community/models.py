from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class CommunityCategory(models.Model):
    slug = models.SlugField(_("Kısa ad (slug)"), unique=True)
    title = models.CharField(_("Başlık"), max_length=120)
    description = models.TextField(_("Açıklama"), blank=True, default="")
    is_active = models.BooleanField(_("Aktif"), default=True)

    class Meta:
        ordering = ["title"]
        verbose_name = _("Topluluk kategorisi")
        verbose_name_plural = _("Topluluk kategorileri")

    def __str__(self) -> str:
        return self.title


class CommunityPostType(models.TextChoices):
    QUESTION = "question", "Soru"
    UPDATE = "update", "Güncelleme"
    EVENT = "event", "Etkinlik"


class CommunityPostStatus(models.TextChoices):
    PENDING = "pending", "Beklemede"
    APPROVED = "approved", "Onaylandı"
    REJECTED = "rejected", "Reddedildi"


class CommunityPost(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="community_posts",
        verbose_name=_("Yazar"),
    )
    category = models.ForeignKey(
        CommunityCategory,
        on_delete=models.PROTECT,
        related_name="posts",
        verbose_name=_("Kategori"),
    )

    type = models.CharField(_("Tür"), max_length=20, choices=CommunityPostType.choices, default=CommunityPostType.QUESTION)
    status = models.CharField(
        _("Durum"),
        max_length=20,
        choices=CommunityPostStatus.choices,
        default=CommunityPostStatus.PENDING,
        help_text=_("Moderasyon sonrası yayına alınır."),
    )

    title = models.CharField(_("Başlık"), max_length=180)
    body = models.TextField(_("İçerik"))

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_posts",
        verbose_name=_("Onaylayan"),
    )
    approved_at = models.DateTimeField(_("Onay zamanı"), null=True, blank=True)

    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Güncellenme"), auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Topluluk gönderisi")
        verbose_name_plural = _("Topluluk gönderileri")
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["category", "status", "created_at"]),
        ]


class CommunityAnswer(models.Model):
    post = models.ForeignKey(
        CommunityPost,
        on_delete=models.CASCADE,
        related_name="answers",
        verbose_name=_("Gönderi"),
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="community_answers",
        verbose_name=_("Yazar"),
    )
    body = models.TextField(_("İçerik"))
    is_accepted = models.BooleanField(
        _("En iyi cevap"),
        default=False,
        help_text=_("Gönderi sahibi veya moderatör tarafından işaretlenir; soru başlığında tek olabilir."),
    )
    status = models.CharField(
        _("Durum"),
        max_length=20,
        choices=CommunityPostStatus.choices,
        default=CommunityPostStatus.PENDING,
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_answers",
        verbose_name=_("Onaylayan"),
    )
    approved_at = models.DateTimeField(_("Onay zamanı"), null=True, blank=True)
    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = _("Topluluk yanıtı")
        verbose_name_plural = _("Topluluk yanıtları")
        constraints = [
            models.UniqueConstraint(
                fields=["post"],
                condition=models.Q(is_accepted=True),
                name="community_answer_one_accepted_per_post",
            ),
        ]
