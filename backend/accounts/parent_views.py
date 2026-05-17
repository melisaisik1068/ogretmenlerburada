from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import ParentStudentLink, UserRole
from booking.models import Appointment, AppointmentStatus
from exams.models import ExamAttempt, AttemptStatus
from progress.models import LessonProgress

User = get_user_model()


class ParentDashboardView(APIView):
    """Veli: bağlı öğrencilerin özet raporu (bento grid için JSON)."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != UserRole.PARENT:
            return Response({"detail": "Yalnızca veli hesabı erişebilir."}, status=403)

        links = ParentStudentLink.objects.filter(parent=request.user).select_related("student")
        students_payload = []

        for link in links:
            student = link.student
            name = f"{student.first_name} {student.last_name}".strip() or student.username

            exams = (
                ExamAttempt.objects.filter(
                    user=student,
                    status__in=[AttemptStatus.SUBMITTED, AttemptStatus.EXPIRED],
                )
                .select_related("exam")
                .order_by("-submitted_at")[:5]
            )
            exam_cards = [
                {
                    "exam_title": a.exam.title,
                    "net_score": float(a.net_score),
                    "correct": a.correct_count,
                    "wrong": a.wrong_count,
                    "blank": a.blank_count,
                    "summary": a.analysis_summary,
                    "submitted_at": a.submitted_at,
                }
                for a in exams
            ]

            appointments = (
                Appointment.objects.filter(student=student)
                .select_related("teacher")
                .order_by("-starts_at")[:8]
            )
            live_lessons = [
                {
                    "starts_at": ap.starts_at,
                    "status": ap.status,
                    "teacher_name": (
                        f"{ap.teacher.first_name} {ap.teacher.last_name}".strip() or ap.teacher.username
                    ),
                    "attended": ap.status == AppointmentStatus.COMPLETED,
                }
                for ap in appointments
            ]

            progress_rows = LessonProgress.objects.filter(user=student).select_related("lesson", "lesson__course")
            completed = progress_rows.filter(is_completed=True).count()
            total_progress = progress_rows.count()
            avg_percent = 0
            if progress_rows.exists():
                avg_percent = int(
                    sum(min(100, max(0, r.progress_percent)) for r in progress_rows) / progress_rows.count()
                )

            students_payload.append(
                {
                    "student_id": student.id,
                    "display_name": name,
                    "label": link.label,
                    "stats": {
                        "lessons_completed": completed,
                        "lessons_tracked": total_progress,
                        "avg_progress_percent": avg_percent,
                        "last_exam_net": exam_cards[0]["net_score"] if exam_cards else None,
                    },
                    "exams": exam_cards,
                    "live_lessons": live_lessons,
                }
            )

        return Response({"students": students_payload})


class ParentLinkStudentView(APIView):
    """Veli, öğrenci kullanıcı adı ile çocuğunu bağlar."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != UserRole.PARENT:
            return Response({"detail": "Yalnızca veli hesabı."}, status=403)

        username = (request.data.get("student_username") or "").strip()
        label = (request.data.get("label") or "").strip()
        if not username:
            return Response({"detail": "student_username zorunlu."}, status=400)

        student = User.objects.filter(username__iexact=username, role=UserRole.STUDENT).first()
        if not student:
            return Response({"detail": "Öğrenci bulunamadı."}, status=404)

        link, created = ParentStudentLink.objects.get_or_create(
            parent=request.user,
            student=student,
            defaults={"label": label},
        )
        if not created and label:
            link.label = label
            link.save(update_fields=["label"])

        return Response(
            {
                "ok": True,
                "created": created,
                "student_id": student.id,
                "display_name": f"{student.first_name} {student.last_name}".strip() or student.username,
            }
        )
