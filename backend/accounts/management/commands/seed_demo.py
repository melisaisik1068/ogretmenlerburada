import os

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from accounts.models import TeacherVerificationStatus, UserRole


class Command(BaseCommand):
    help = "Demo hesapları oluşturur (admin + student)."

    def handle(self, *args, **options):
        allow = os.getenv("ALLOW_DEMO_SEED", "0") == "1"
        if not settings.DEBUG and not allow:
            self.stderr.write("Production ortamında seed kapalı. (ALLOW_DEMO_SEED=1 ile açabilirsiniz)")
            return

        User = get_user_model()

        password = os.getenv("DEMO_PASSWORD", "Demo12345!").strip()

        admin_username = os.getenv("DEMO_ADMIN_USERNAME", "demo_admin").strip()
        admin_email = os.getenv("DEMO_ADMIN_EMAIL", "admin@demo.local").strip()

        student_username = os.getenv("DEMO_STUDENT_USERNAME", "demo_student").strip()
        student_email = os.getenv("DEMO_STUDENT_EMAIL", "student@demo.local").strip()

        admin, admin_created = User.objects.get_or_create(
            username=admin_username,
            defaults={
                "email": admin_email,
                "is_staff": True,
                "is_superuser": True,
                "role": UserRole.TEACHER,
                "teacher_verification_status": TeacherVerificationStatus.APPROVED,
            },
        )
        if admin_created:
            admin.set_password(password)
            admin.save(update_fields=["password"])
        else:
            if not admin.is_staff or not admin.is_superuser:
                admin.is_staff = True
                admin.is_superuser = True
                admin.save(update_fields=["is_staff", "is_superuser"])

        student, student_created = User.objects.get_or_create(
            username=student_username,
            defaults={
                "email": student_email,
                "role": UserRole.STUDENT,
            },
        )
        if student_created:
            student.set_password(password)
            student.save(update_fields=["password"])

        self.stdout.write("Demo hesaplar hazır:")
        self.stdout.write(f"- admin: {admin_username} / {password}  (email: {admin.email})")
        self.stdout.write(f"- student: {student_username} / {password} (email: {student.email})")

