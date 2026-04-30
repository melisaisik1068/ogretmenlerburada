from django.conf import settings
from django.db import models


class LessonProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lesson_progress")
    lesson = models.ForeignKey("lessons.Lesson", on_delete=models.CASCADE, related_name="progress_rows")

    is_completed = models.BooleanField(default=False)
    progress_percent = models.PositiveSmallIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [("user", "lesson")]
        indexes = [models.Index(fields=["user", "updated_at"])]
        ordering = ["-updated_at"]

