from django.db import models
from django.utils.translation import gettext_lazy as _


class ContactMessage(models.Model):
    name = models.CharField(_("Ad Soyad"), max_length=120)
    email = models.EmailField(_("E-posta"))
    message = models.TextField(_("Mesaj"))
    created_at = models.DateTimeField(_("Gönderim zamanı"), auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("İletişim mesajı")
        verbose_name_plural = _("İletişim mesajları")


class NewsletterSubscriber(models.Model):
    email = models.EmailField(_("E-posta"), unique=True, help_text=_("Çift kayıtta hata oluşması için tekilleştirilmiş."))
    created_at = models.DateTimeField(_("Kayıt zamanı"), auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Bülten abonesi")
        verbose_name_plural = _("Bülten aboneleri")
