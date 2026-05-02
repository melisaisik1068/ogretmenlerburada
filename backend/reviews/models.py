from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class CourseReview(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="course_reviews",
        verbose_name=_("Kullanıcı"),
    )
    course = models.ForeignKey(
        "lessons.Course",
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name=_("Kurs"),
    )
    rating = models.PositiveSmallIntegerField(
        _("Puan"),
        help_text=_("1 (en düşük) ile 5 (en yüksek) arasında tam sayı."),
    )
    comment = models.TextField(_("Yorum"), blank=True, default="")
    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Güncellenme"), auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Kurs değerlendirmesi")
        verbose_name_plural = _("Kurs değerlendirmeleri")
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
