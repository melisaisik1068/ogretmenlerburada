from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class LessonProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lesson_progress",
        verbose_name=_("Öğrenci"),
    )
    lesson = models.ForeignKey(
        "lessons.Lesson",
        on_delete=models.CASCADE,
        related_name="progress_rows",
        verbose_name=_("Ders"),
    )

    is_completed = models.BooleanField(
        _("Tamamlandı"),
        default=False,
        help_text=_("Öğrenci ders sonuna geldi olarak işaretledi."),
    )
    progress_percent = models.PositiveSmallIntegerField(
        _("Tamamlama yüzdesi"),
        default=0,
        help_text=_("0–100 arası ilerleme göstergesi."),
    )

    updated_at = models.DateTimeField(_("Son güncelleme"), auto_now=True)
    created_at = models.DateTimeField(_("İlk kayıt"), auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["user", "updated_at"])]
        ordering = ["-updated_at"]
        verbose_name = _("Ders ilerlemesi")
        verbose_name_plural = _("Ders ilerlemeleri")
        constraints = [
            models.UniqueConstraint(
                fields=("user", "lesson"),
                name="progress_lessonprogress_user_lesson_uniq",
            ),
        ]
