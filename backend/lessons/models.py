from django.conf import settings
from django.db import models


class Subject(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=120)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return self.title


class CourseAccessLevel(models.TextChoices):
    FREE = "free", "Ücretsiz"
    BASIC = "basic", "Temel"
    PRO = "pro", "Pro"
    ENTERPRISE = "enterprise", "Kurumsal"


class Course(models.Model):
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="courses")
    subject = models.ForeignKey(Subject, on_delete=models.PROTECT, related_name="courses")

    title = models.CharField(max_length=180)
    description = models.TextField(blank=True, default="")
    cover_image_url = models.URLField(blank=True, default="")

    access_level = models.CharField(max_length=20, choices=CourseAccessLevel.choices, default=CourseAccessLevel.FREE)
    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["is_published", "created_at"]),
            models.Index(fields=["subject", "is_published", "created_at"]),
        ]


class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=180)
    duration_minutes = models.PositiveIntegerField(default=45)
    price_try = models.PositiveIntegerField(default=0)

    content = models.TextField(blank=True, default="")  # MVP: markdown/text
    video_url = models.URLField(blank=True, default="")

    order_index = models.PositiveIntegerField(default=0)
    is_preview = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order_index", "id"]
        indexes = [models.Index(fields=["course", "is_published", "order_index"])]
