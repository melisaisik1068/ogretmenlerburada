"""
Kullanım (Railway veya lokal):
  python manage.py create_admin

Ortam değişkenleri (varsayılanlar parantez içinde):
  ADMIN_USERNAME  (qaadmin)
  ADMIN_EMAIL     (admin@ogretmenlerburada.com)
  ADMIN_PASSWORD  (QaAdmin2026!)
"""

import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD env var'larına göre superuser oluşturur veya günceller."

    def handle(self, *args, **options):
        User = get_user_model()

        username = os.environ.get("ADMIN_USERNAME", "qaadmin").strip()
        email    = os.environ.get("ADMIN_EMAIL",    "admin@ogretmenlerburada.com").strip()
        password = os.environ.get("ADMIN_PASSWORD", "QaAdmin2026!").strip()

        user, created = User.objects.get_or_create(username=username)
        user.email        = email
        user.is_staff     = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        action = "oluşturuldu" if created else "güncellendi"
        self.stdout.write(self.style.SUCCESS(
            f"✅ Admin hesabı {action}: {username} / {password}  (e-posta: {email})"
        ))
