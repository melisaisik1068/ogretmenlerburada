from django.conf import settings
from django.db import models


class CommunityCategory(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["title"]

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
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="community_posts")
    category = models.ForeignKey(CommunityCategory, on_delete=models.PROTECT, related_name="posts")

    type = models.CharField(max_length=20, choices=CommunityPostType.choices, default=CommunityPostType.QUESTION)
    status = models.CharField(max_length=20, choices=CommunityPostStatus.choices, default=CommunityPostStatus.PENDING)

    title = models.CharField(max_length=180)
    body = models.TextField()

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="approved_posts"
    )
    approved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["category", "status", "created_at"]),
        ]


class CommunityAnswer(models.Model):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name="answers")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="community_answers")
    body = models.TextField()
    status = models.CharField(max_length=20, choices=CommunityPostStatus.choices, default=CommunityPostStatus.PENDING)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="approved_answers"
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
