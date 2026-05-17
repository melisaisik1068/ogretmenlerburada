from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class ExamType(models.TextChoices):
    LGS = "lgs", "LGS"
    YKS = "yks", "YKS"
    ALES = "ales", "ALES"
    CUSTOM = "custom", "Özel"


class Exam(models.Model):
    title = models.CharField(_("Başlık"), max_length=200)
    exam_type = models.CharField(
        _("Sınav türü"),
        max_length=20,
        choices=ExamType.choices,
        default=ExamType.CUSTOM,
    )
    description = models.TextField(_("Açıklama"), blank=True, default="")
    duration_minutes = models.PositiveIntegerField(
        _("Süre (dakika)"),
        default=120,
        help_text=_("Sayaç sunucuda biter; tarayıcı kapansa da süre işler."),
    )
    negative_per_wrong = models.DecimalField(
        _("Yanlış başına düşülen net"),
        max_digits=4,
        decimal_places=2,
        default=0.25,
        help_text=_("LGS/YKS için genelde 0,25; ALES farklı olabilir."),
    )
    is_published = models.BooleanField(_("Yayında"), default=False)
    show_leaderboard = models.BooleanField(
        _("Sıralama tablosu"),
        default=True,
        help_text=_("Kurum / Türkiye geneli sıralama listesinde göster."),
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_exams",
        verbose_name=_("Oluşturan"),
    )
    created_at = models.DateTimeField(_("Oluşturulma"), auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Deneme sınavı")
        verbose_name_plural = _("Deneme sınavları")

    def __str__(self) -> str:
        return self.title


class ExamQuestion(models.Model):
    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name="questions",
        verbose_name=_("Sınav"),
    )
    order_index = models.PositiveIntegerField(_("Sıra"), default=0)
    topic_slug = models.SlugField(_("Konu kodu"), max_length=80, blank=True, default="")
    topic_title = models.CharField(_("Konu adı"), max_length=160, blank=True, default="")
    correct_choice = models.CharField(
        _("Doğru şık"),
        max_length=1,
        help_text=_("A, B, C, D veya E"),
    )
    choice_count = models.PositiveSmallIntegerField(_("Şık sayısı"), default=5)

    class Meta:
        ordering = ["order_index", "id"]
        verbose_name = _("Sınav sorusu")
        verbose_name_plural = _("Sınav soruları")


class AttemptStatus(models.TextChoices):
    IN_PROGRESS = "in_progress", "Devam ediyor"
    SUBMITTED = "submitted", "Gönderildi"
    EXPIRED = "expired", "Süre doldu"


class ExamAttempt(models.Model):
    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name="attempts",
        verbose_name=_("Sınav"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="exam_attempts",
        verbose_name=_("Öğrenci"),
    )
    status = models.CharField(
        _("Durum"),
        max_length=20,
        choices=AttemptStatus.choices,
        default=AttemptStatus.IN_PROGRESS,
    )
    started_at = models.DateTimeField(_("Başlangıç"), auto_now_add=True)
    ends_at = models.DateTimeField(_("Bitiş (sunucu)"), help_text=_("Süre bu zamanda dolar."))
    submitted_at = models.DateTimeField(_("Gönderim"), null=True, blank=True)

    correct_count = models.PositiveIntegerField(_("Doğru"), default=0)
    wrong_count = models.PositiveIntegerField(_("Yanlış"), default=0)
    blank_count = models.PositiveIntegerField(_("Boş"), default=0)
    net_score = models.DecimalField(_("Net"), max_digits=8, decimal_places=2, default=0)

    analysis_summary = models.TextField(
        _("Analiz özeti"),
        blank=True,
        default="",
        help_text=_("Konu bazlı otomatik yorum."),
    )

    class Meta:
        ordering = ["-started_at"]
        verbose_name = _("Sınav oturumu")
        verbose_name_plural = _("Sınav oturumları")
        indexes = [
            models.Index(fields=["exam", "status", "net_score"]),
            models.Index(fields=["user", "exam"]),
        ]


class ExamAnswer(models.Model):
    attempt = models.ForeignKey(
        ExamAttempt,
        on_delete=models.CASCADE,
        related_name="answers",
        verbose_name=_("Oturum"),
    )
    question = models.ForeignKey(
        ExamQuestion,
        on_delete=models.CASCADE,
        related_name="answers",
        verbose_name=_("Soru"),
    )
    choice = models.CharField(
        _("İşaretlenen şık"),
        max_length=1,
        blank=True,
        default="",
        help_text=_("Boş bırakıldıysa boş string."),
    )

    class Meta:
        verbose_name = _("Cevap")
        verbose_name_plural = _("Cevaplar")
        constraints = [
            models.UniqueConstraint(
                fields=("attempt", "question"),
                name="exams_examanswer_attempt_question_uniq",
            ),
        ]
