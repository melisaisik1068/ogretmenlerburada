from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Subject(models.Model):
    slug = models.SlugField(_("Kısa ad (slug)"), unique=True)
    title = models.CharField(_("Başlık"), max_length=120)
    is_active = models.BooleanField(_("Aktif"), default=True)

    class Meta:
        ordering = ["title"]
        verbose_name = _("Branş / konu")
        verbose_name_plural = _("Branşlar / konular")

    def __str__(self) -> str:
        return self.title


class CourseAccessLevel(models.TextChoices):
    FREE = "free", "Ücretsiz"
    BASIC = "basic", "Temel"
    PRO = "pro", "Pro"
    ENTERPRISE = "enterprise", "Kurumsal"


class Course(models.Model):
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="courses",
        verbose_name=_("Eğitmen"),
        help_text=_("Bu kursu oluşturan kullanıcı."),
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.PROTECT,
        related_name="courses",
        verbose_name=_("Branş"),
    )

    title = models.CharField(_("Başlık"), max_length=180)
    description = models.TextField(_("Açıklama"), blank=True, default="")
    cover_image_url = models.URLField(
        _("Kapak görseli URL"),
        blank=True,
        default="",
        help_text=_("Liste ve detayda görünecek kapak görseli."),
    )

    access_level = models.CharField(
        _("Erişim seviyesi"),
        max_length=20,
        choices=CourseAccessLevel.choices,
        default=CourseAccessLevel.FREE,
        help_text=_("Abonelik veya kilitleme kuralları için etiket."),
    )
    is_published = models.BooleanField(
        _("Yayında"),
        default=False,
        help_text=_("İşaretli değilse herkese açık liste dışına alınır."),
    )

    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Güncellenme"), auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Kurs")
        verbose_name_plural = _("Kurslar")
        indexes = [
            models.Index(fields=["is_published", "created_at"]),
            models.Index(fields=["subject", "is_published", "created_at"]),
        ]

    def __str__(self) -> str:
        return self.title


class Lesson(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="lessons",
        verbose_name=_("Kurs"),
    )
    title = models.CharField(_("Başlık"), max_length=180)
    duration_minutes = models.PositiveIntegerField(
        _("Süre (dakika)"),
        default=45,
        help_text=_("Öğrenme süresinin tahmini uzunluğu."),
    )
    price_try = models.PositiveIntegerField(
        _("Fiyat (₺)"),
        default=0,
        help_text=_("Ücretli içerikler için Türk Lirası."),
    )

    content = models.TextField(
        _("İçerik"),
        blank=True,
        default="",
        help_text=_("Markdown veya düz metin ders içeriği."),
    )
    video_url = models.URLField(
        _("Video URL"),
        blank=True,
        default="",
        help_text=_("İsteğe bağlı uzaktan içerik adresi."),
    )

    order_index = models.PositiveIntegerField(_("Sıra"), default=0, help_text=_("Çalma/liste sırası (küçük önce gelir)."))
    is_preview = models.BooleanField(
        _("Ön izleme"),
        default=False,
        help_text=_("Üyeliğe bağlı olmadan görülebilecek kısa içerik."),
    )
    is_published = models.BooleanField(_("Yayında"), default=False)
    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)

    class Meta:
        ordering = ["order_index", "id"]
        verbose_name = _("Ders")
        verbose_name_plural = _("Dersler")
        indexes = [models.Index(fields=["course", "is_published", "order_index"])]

    def __str__(self) -> str:
        return self.title
