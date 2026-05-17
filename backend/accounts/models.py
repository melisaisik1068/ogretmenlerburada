from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserRole(models.TextChoices):
    TEACHER = "teacher", "Öğretmen"
    STUDENT = "student", "Öğrenci"
    PARENT = "parent", "Veli"


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

    phone = models.CharField(
        _("Telefon"),
        max_length=32,
        blank=True,
        default="",
        help_text=_("E.164 formatı önerilir (örn. +905xxxxxxxxx). Aynı telefonla ikinci kayıt açılmaz."),
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
        indexes = [
            models.Index(fields=["phone"]),
            models.Index(fields=["email"]),
        ]


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


class ParentStudentLink(models.Model):
    """Veli–öğrenci ilişkisi; veli panelinde yalnızca bağlı öğrenciler görünür."""

    parent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="parent_links",
        verbose_name=_("Veli"),
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_parent_links",
        verbose_name=_("Öğrenci"),
    )
    label = models.CharField(
        _("İlişki etiketi"),
        max_length=80,
        blank=True,
        default="",
        help_text=_("Örn. 'Oğlum', 'Kızım'."),
    )
    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)

    class Meta:
        verbose_name = _("Veli–öğrenci bağlantısı")
        verbose_name_plural = _("Veli–öğrenci bağlantıları")
        constraints = [
            models.UniqueConstraint(
                fields=("parent", "student"),
                name="accounts_parentstudentlink_parent_student_uniq",
            ),
        ]
