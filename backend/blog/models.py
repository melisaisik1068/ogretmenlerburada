from django.db import models


class BlogPost(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    excerpt = models.TextField(blank=True, default="")
    content = models.TextField(blank=True, default="")
    cover_image_url = models.URLField(blank=True, default="")

    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        verbose_name = "Blog yazısı"
        verbose_name_plural = "Blog yazıları"
        indexes = [
            models.Index(fields=["is_published", "published_at"]),
            models.Index(fields=["slug"]),
        ]

    def __str__(self) -> str:
        return self.title

