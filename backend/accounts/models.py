from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    TEACHER = "teacher", "Öğretmen"
    STUDENT = "student", "Öğrenci"


class TeacherVerificationStatus(models.TextChoices):
    NOT_REQUIRED = "not_required", "Gerekmez"
    PENDING = "pending", "Beklemede"
    APPROVED = "approved", "Onaylandı"
    REJECTED = "rejected", "Reddedildi"


class User(AbstractUser):
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.STUDENT)

    bio = models.TextField(blank=True, default="")
    avatar_url = models.URLField(blank=True, default="")

    teacher_verification_status = models.CharField(
        max_length=20,
        choices=TeacherVerificationStatus.choices,
        default=TeacherVerificationStatus.NOT_REQUIRED,
    )
    teacher_verified_at = models.DateTimeField(null=True, blank=True)

    @property
    def is_teacher_verified(self) -> bool:
        return self.role == UserRole.TEACHER and self.teacher_verification_status == TeacherVerificationStatus.APPROVED


class TeacherVerificationDocument(models.Model):
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="verification_documents")
    file = models.FileField(upload_to="teacher-docs/%Y/%m/")
    original_filename = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
