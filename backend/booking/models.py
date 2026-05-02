from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Weekday(models.IntegerChoices):
    MON = 1, "Pazartesi"
    TUE = 2, "Salı"
    WED = 3, "Çarşamba"
    THU = 4, "Perşembe"
    FRI = 5, "Cuma"
    SAT = 6, "Cumartesi"
    SUN = 7, "Pazar"


class TeacherAvailability(models.Model):
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="availabilities",
        verbose_name=_("Öğretmen"),
    )
    weekday = models.IntegerField(_("Haftanın günü"), choices=Weekday.choices)
    start_time = models.TimeField(_("Başlangıç saati"))
    end_time = models.TimeField(_("Bitiş saati"))
    is_active = models.BooleanField(_("Aktif"), default=True, help_text=_("Pasif bloklar öğrenciye gösterilmez."))

    class Meta:
        ordering = ["weekday", "start_time"]
        verbose_name = _("Öğretmen müsaitliği")
        verbose_name_plural = _("Öğretmen müsaitlikleri")
        constraints = [
            models.UniqueConstraint(
                fields=("teacher", "weekday", "start_time", "end_time"),
                name="booking_teacheravail_teacher_weekday_slot_uniq",
            ),
        ]


class AppointmentStatus(models.TextChoices):
    PENDING = "pending", "Beklemede"
    CONFIRMED = "confirmed", "Onaylandı"
    CANCELED = "canceled", "İptal"
    COMPLETED = "completed", "Tamamlandı"


class Appointment(models.Model):
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teacher_appointments",
        verbose_name=_("Öğretmen"),
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_appointments",
        verbose_name=_("Öğrenci"),
    )

    starts_at = models.DateTimeField(_("Başlangıç"))
    ends_at = models.DateTimeField(_("Bitiş"))
    status = models.CharField(
        _("Durum"),
        max_length=20,
        choices=AppointmentStatus.choices,
        default=AppointmentStatus.PENDING,
    )

    note = models.CharField(
        _("Not"),
        max_length=500,
        blank=True,
        default="",
        help_text=_("Tarafların görebileceği kısa açıklama."),
    )
    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)

    class Meta:
        ordering = ["-starts_at"]
        verbose_name = _("Randevu")
        verbose_name_plural = _("Randevular")
        indexes = [
            models.Index(fields=["teacher", "starts_at"]),
            models.Index(fields=["student", "starts_at"]),
        ]
