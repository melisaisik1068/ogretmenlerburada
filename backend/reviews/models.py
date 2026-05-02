from django.conf import settings
from django.db import models


class CourseReview(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="course_reviews")
    course = models.ForeignKey("lessons.Course", on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField()  # 1..5
    comment = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Kurs değerlendirmesi"
        verbose_name_plural = "Kurs değerlendirmeleri"
        constraints = [
            models.UniqueConstraint(
                fields=("user", "course"),
                name="reviews_coursereview_user_course_uniq",
            ),
        ]
        indexes = [
            models.Index(fields=["course", "created_at"]),
            models.Index(fields=["course", "rating"]),
        ]

