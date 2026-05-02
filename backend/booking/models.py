from django.conf import settings
from django.db import models


class Weekday(models.IntegerChoices):
    MON = 1, "Pazartesi"
    TUE = 2, "Salı"
    WED = 3, "Çarşamba"
    THU = 4, "Perşembe"
    FRI = 5, "Cuma"
    SAT = 6, "Cumartesi"
    SUN = 7, "Pazar"


class TeacherAvailability(models.Model):
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="availabilities")
    weekday = models.IntegerField(choices=Weekday.choices)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["weekday", "start_time"]
        verbose_name = "Öğretmen müsaitliği"
        verbose_name_plural = "Öğretmen müsaitlikleri"
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
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="teacher_appointments")
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_appointments")

    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=AppointmentStatus.choices, default=AppointmentStatus.PENDING)

    note = models.CharField(max_length=500, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-starts_at"]
        verbose_name = "Randevu"
        verbose_name_plural = "Randevular"
        indexes = [
            models.Index(fields=["teacher", "starts_at"]),
            models.Index(fields=["student", "starts_at"]),
        ]
