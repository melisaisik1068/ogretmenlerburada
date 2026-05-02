"""İsteğe bağlı bildirim e-postaları (SMTP/console). Başarısızlıkta loglar, API'yi düşürmez."""

import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def _recipients(primary: str | None) -> list[str]:
    if not primary or not primary.strip():
        return []
    return [primary.strip()]


def notify_subscription_started(user_email: str | None, *, plan_title: str) -> None:
    recipients = _recipients(user_email)
    if not recipients:
        return
    subject = f"ÖğretmenAğı — abonelik aktif ({plan_title})"
    body = (
        f"Merhaba,\n\n{plan_title} aboneliğiniz oluşturuldu / güncellendi.\n\n"
        f"Yönetim: {settings.FRONTEND_PUBLIC_URL}/dashboard/subscription\n"
    )
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, recipients, fail_silently=False)
    except Exception:
        logger.exception("notify_subscription_started mail failed")


def notify_shop_purchase(user_email: str | None, *, material_title: str, amount_try: int) -> None:
    recipients = _recipients(user_email)
    if not recipients:
        return
    subject = "ÖğretmenAğı — materyal satın alımı"
    body = (
        f"Merhaba,\n\n'{material_title}' için {amount_try} ₺ ödemeniz alındı.\n\n"
        f"İndirme hesabınızdan: {settings.FRONTEND_PUBLIC_URL}/dashboard/orders\n"
    )
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, recipients, fail_silently=False)
    except Exception:
        logger.exception("notify_shop_purchase mail failed")


def notify_password_reset(user_email: str, *, reset_link: str) -> None:
    subject = "ÖğretmenAğı — şifre sıfırlama"
    body = (
        "Şifrenizi sıfırlamak için aşağıdaki bağlantıyı kullanın (süreli).\n\n"
        f"{reset_link}\n\n"
        "İstemediyseniz bu e-postayı yok sayın.\n"
    )
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [user_email], fail_silently=False)
    except Exception:
        logger.exception("notify_password_reset mail failed")
