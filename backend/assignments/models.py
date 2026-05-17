from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class HomeworkStatus(models.TextChoices):
    OPEN = "open", "Açık"
    CLOSED = "closed", "Kapalı"


class Homework(models.Model):
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="homeworks",
        verbose_name=_("Öğretmen"),
    )
    title = models.CharField(_("Başlık"), max_length=200)
    description = models.TextField(_("Açıklama"), blank=True, default="")
    due_at = models.DateTimeField(_("Son teslim"), null=True, blank=True)
    status = models.CharField(
        _("Durum"),
        max_length=20,
        choices=HomeworkStatus.choices,
        default=HomeworkStatus.OPEN,
    )
    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Ödev")
        verbose_name_plural = _("Ödevler")

    def __str__(self) -> str:
        return self.title


class SubmissionStatus(models.TextChoices):
    PENDING = "pending", "Beklemede"
    REVIEWED = "reviewed", "İncelendi"
    APPROVED = "approved", "Onaylandı"
    REJECTED = "rejected", "Reddedildi"


class HomeworkSubmission(models.Model):
    homework = models.ForeignKey(
        Homework,
        on_delete=models.CASCADE,
        related_name="submissions",
        verbose_name=_("Ödev"),
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="homework_submissions",
        verbose_name=_("Öğrenci"),
    )
    photo = models.FileField(
        _("Ödev fotoğrafı"),
        upload_to="homework/%Y/%m/",
        help_text=_("Öğrencinin çektiği ödev görseli (JPG/PNG/PDF)."),
    )
    note = models.TextField(_("Öğrenci notu"), blank=True, default="")
    status = models.CharField(
        _("Durum"),
        max_length=20,
        choices=SubmissionStatus.choices,
        default=SubmissionStatus.PENDING,
    )
    teacher_feedback = models.TextField(_("Öğretmen geri bildirimi"), blank=True, default="")
    submitted_at = models.DateTimeField(_("Yükleme"), auto_now_add=True)

    class Meta:
        ordering = ["-submitted_at"]
        verbose_name = _("Ödev teslimi")
        verbose_name_plural = _("Ödev teslimleri")
        constraints = [
            models.UniqueConstraint(
                fields=("homework", "student"),
                name="assignments_homeworksubmission_homework_student_uniq",
            ),
        ]
