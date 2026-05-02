from django.db import models
from django.utils.translation import gettext_lazy as _


class Event(models.Model):
    slug = models.SlugField(_("Kısa ad (slug)"), unique=True)
    title = models.CharField(_("Başlık"), max_length=200)
    description = models.TextField(_("Açıklama"), blank=True, default="")
    location = models.CharField(_("Konum"), max_length=180, blank=True, default="")

    starts_at = models.DateTimeField(_("Başlangıç"), null=True, blank=True)
    ends_at = models.DateTimeField(_("Bitiş"), null=True, blank=True)

    cover_image_url = models.URLField(_("Kapak URL"), blank=True, default="")
    is_published = models.BooleanField(_("Yayında"), default=False)
    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)

    class Meta:
        ordering = ["-starts_at", "-created_at"]
        verbose_name = _("Etkinlik")
        verbose_name_plural = _("Etkinlikler")
        indexes = [
            models.Index(fields=["is_published", "starts_at"]),
            models.Index(fields=["slug"]),
        ]

    def __str__(self) -> str:
        return self.title
