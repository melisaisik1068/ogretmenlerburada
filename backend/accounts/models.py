from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserRole(models.TextChoices):
    TEACHER = "teacher", "Öğretmen"
    STUDENT = "student", "Öğrenci"


class TeacherVerificationStatus(models.TextChoices):
    NOT_REQUIRED = "not_required", "Gerekmez"
    PENDING = "pending", "Beklemede"
    APPROVED = "approved", "Onaylandı"
    REJECTED = "rejected", "Reddedildi"


class User(AbstractUser):
    role = models.CharField(
        _("Rol"),
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.STUDENT,
        help_text=_("Öğretmen mi öğrenci mi olduğunu belirtir."),
    )

    bio = models.TextField(
        _("Biyografi"),
        blank=True,
        default="",
        help_text=_("Profilde görünebilecek kısa tanıtım."),
    )
    avatar_url = models.URLField(
        _("Profil görseli URL"),
        blank=True,
        default="",
        help_text=_("Harici barındırılan profil fotoğrafı bağlantısı."),
    )

    teacher_verification_status = models.CharField(
        _("Öğretmen doğrulama durumu"),
        max_length=20,
        choices=TeacherVerificationStatus.choices,
        default=TeacherVerificationStatus.NOT_REQUIRED,
        help_text=_("Öğretmen profili için belge inceleme sürecinin durumu."),
    )
    teacher_verified_at = models.DateTimeField(
        _("Doğrulama onay zamanı"),
        null=True,
        blank=True,
        help_text=_("Onaylandığında admin tarafından işaretlenebilir."),
    )

    @property
    def is_teacher_verified(self) -> bool:
        return self.role == UserRole.TEACHER and self.teacher_verification_status == TeacherVerificationStatus.APPROVED

    class Meta:
        verbose_name = _("Kullanıcı")
        verbose_name_plural = _("Kullanıcılar")


class TeacherVerificationDocument(models.Model):
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="verification_documents",
        verbose_name=_("Öğretmen"),
    )
    file = models.FileField(
        _("Belge dosyası"),
        upload_to="teacher-docs/%Y/%m/",
        help_text=_("Kimlik, diploma veya benzeri doğrulama evrakı."),
    )
    original_filename = models.CharField(
        _("Orijinal dosya adı"),
        max_length=255,
        blank=True,
        default="",
        help_text=_("Yükleme sırasında tarayıcıdan gelen ad (isteğe bağlı)."),
    )
    created_at = models.DateTimeField(_("Yükleme zamanı"), auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Öğretmen doğrulama belgesi")
        verbose_name_plural = _("Öğretmen doğrulama belgeleri")
