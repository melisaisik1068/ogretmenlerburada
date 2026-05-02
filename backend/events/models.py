from django.db import models


class Event(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    location = models.CharField(max_length=180, blank=True, default="")

    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)

    cover_image_url = models.URLField(blank=True, default="")
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-starts_at", "-created_at"]
        verbose_name = "Etkinlik"
        verbose_name_plural = "Etkinlikler"
        indexes = [
            models.Index(fields=["is_published", "starts_at"]),
            models.Index(fields=["slug"]),
        ]

    def __str__(self) -> str:
        return self.title

