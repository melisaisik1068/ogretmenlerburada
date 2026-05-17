import os

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from datetime import timedelta

from django.utils import timezone

from accounts.models import ParentStudentLink, TeacherVerificationStatus, UserRole
from assignments.models import Homework, HomeworkStatus
from subscriptions.models import InstitutionPackage, StudentPackageSubscription, SubscriptionStatus


class Command(BaseCommand):
    help = "Demo hesapları ve örnek veri (admin, öğretmen, öğrenci, veli, paket, ödev)."

    def handle(self, *args, **options):
        allow = os.getenv("ALLOW_DEMO_SEED", "0") == "1"
        if not settings.DEBUG and not allow:
            self.stderr.write("Production ortamında seed kapalı. (ALLOW_DEMO_SEED=1 ile açabilirsiniz)")
            return

        User = get_user_model()
        password = os.getenv("DEMO_PASSWORD", "Demo12345!").strip()

        def ensure_user(username, email, role, **extra):
            user, created = User.objects.get_or_create(
                username=username,
                defaults={"email": email, "role": role, **extra},
            )
            if created:
                user.set_password(password)
                user.save(update_fields=["password"])
            return user, created

        admin, _ = ensure_user(
            os.getenv("DEMO_ADMIN_USERNAME", "demo_admin"),
            os.getenv("DEMO_ADMIN_EMAIL", "admin@demo.local"),
            UserRole.TEACHER,
            is_staff=True,
            is_superuser=True,
            teacher_verification_status=TeacherVerificationStatus.APPROVED,
        )
        if not admin.is_staff:
            admin.is_staff = True
            admin.is_superuser = True
            admin.save(update_fields=["is_staff", "is_superuser"])

        teacher, _ = ensure_user(
            os.getenv("DEMO_TEACHER_USERNAME", "demo_teacher"),
            os.getenv("DEMO_TEACHER_EMAIL", "teacher@demo.local"),
            UserRole.TEACHER,
            first_name="Demo",
            last_name="Öğretmen",
            teacher_verification_status=TeacherVerificationStatus.APPROVED,
        )

        student, _ = ensure_user(
            os.getenv("DEMO_STUDENT_USERNAME", "demo_student"),
            os.getenv("DEMO_STUDENT_EMAIL", "student@demo.local"),
            UserRole.STUDENT,
            first_name="Demo",
            last_name="Öğrenci",
        )

        parent, _ = ensure_user(
            os.getenv("DEMO_PARENT_USERNAME", "demo_veli"),
            os.getenv("DEMO_PARENT_EMAIL", "veli@demo.local"),
            UserRole.PARENT,
            first_name="Demo",
            last_name="Veli",
        )

        ParentStudentLink.objects.get_or_create(parent=parent, student=student, defaults={"label": "Çocuğum"})

        pkg, pkg_created = InstitutionPackage.objects.get_or_create(
            slug="premium-aylik",
            defaults={
                "owner": teacher,
                "title": "Premium Aylık Paket",
                "description": "Tüm premium kurslar + deneme sınavları (500 ₺/ay demo).",
                "price_try": 500,
                "billing_cycle_days": 30,
                "includes_premium_courses": True,
                "includes_all_exams": True,
                "includes_marketplace": False,
                "is_active": True,
            },
        )
        if not pkg_created and pkg.owner_id != teacher.id:
            pkg.owner = teacher
            pkg.save(update_fields=["owner"])

        StudentPackageSubscription.objects.update_or_create(
            user=student,
            package=pkg,
            defaults={
                "status": SubscriptionStatus.ACTIVE,
                "current_period_end": timezone.now() + timedelta(days=30),
            },
        )

        Homework.objects.get_or_create(
            teacher=teacher,
            title="Matematik Ödev 1 — Kareköklü sayılar",
            defaults={
                "description": "Defterindeki 1–10 arası soruların fotoğrafını yükle.",
                "status": HomeworkStatus.OPEN,
                "due_at": timezone.now() + timedelta(days=7),
            },
        )

        self.stdout.write(self.style.SUCCESS("Demo veriler hazır:"))
        self.stdout.write(f"- admin: {admin.username} / {password}")
        self.stdout.write(f"- öğretmen: {teacher.username} / {password}")
        self.stdout.write(f"- öğrenci: {student.username} / {password}")
        self.stdout.write(f"- veli: {parent.username} / {password} (öğrenci: {student.username})")
        self.stdout.write(f"- paket: /paketler → slug: {pkg.slug}")
        self.stdout.write("Sınav demo: python manage.py seed_exams")
