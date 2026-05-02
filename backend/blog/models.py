from django.db import models
from django.utils.translation import gettext_lazy as _


class BlogPost(models.Model):
    slug = models.SlugField(_("Kısa ad (slug)"), unique=True)
    title = models.CharField(_("Başlık"), max_length=200)
    excerpt = models.TextField(_("Özet"), blank=True, default="", help_text=_("Liste ve SEO için kısa metin."))
    content = models.TextField(_("İçerik"), blank=True, default="")
    cover_image_url = models.URLField(_("Kapak URL"), blank=True, default="")

    is_published = models.BooleanField(_("Yayında"), default=False)
    published_at = models.DateTimeField(_("Yayın zamanı"), null=True, blank=True)

    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Güncellenme"), auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        verbose_name = _("Blog yazısı")
        verbose_name_plural = _("Blog yazıları")
        indexes = [
            models.Index(fields=["is_published", "published_at"]),
            models.Index(fields=["slug"]),
        ]

    def __str__(self) -> str:
        return self.title
