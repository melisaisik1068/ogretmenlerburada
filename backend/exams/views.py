from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import UserRole
from accounts.permissions import IsVerifiedTeacher
from subscriptions.access import user_has_institution_feature
from .models import AttemptStatus, Exam, ExamAnswer, ExamAttempt, ExamQuestion
from .serializers import (
    ExamAttemptSerializer,
    ExamDetailSerializer,
    ExamListSerializer,
    LeaderboardEntrySerializer,
)
from .services import finalize_attempt_if_expired, score_attempt, submit_attempt

User = get_user_model()


class ExamViewSet(viewsets.ReadOnlyModelViewSet):
    """Yayınlanmış deneme sınavları."""

    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ExamDetailSerializer
        return ExamListSerializer

    def get_queryset(self):
        qs = Exam.objects.filter(is_published=True).annotate(question_count=Count("questions"))
        exam_type = (self.request.query_params.get("type") or "").strip().lower()
        if exam_type:
            qs = qs.filter(exam_type=exam_type)
        return qs

    @action(detail=True, methods=["get"], permission_classes=[AllowAny])
    def leaderboard(self, request, pk=None):
        exam = self.get_object()
        if not exam.show_leaderboard:
            return Response({"results": []})

        attempts = (
            ExamAttempt.objects.filter(
                exam=exam,
                status__in=[AttemptStatus.SUBMITTED, AttemptStatus.EXPIRED],
            )
            .select_related("user")
            .order_by("-net_score", "submitted_at")[:100]
        )
        results = []
        for rank, att in enumerate(attempts, start=1):
            u = att.user
            name = f"{u.first_name} {u.last_name}".strip() or u.username
            results.append(
                {
                    "rank": rank,
                    "user_id": u.id,
                    "display_name": name,
                    "net_score": att.net_score,
                    "correct_count": att.correct_count,
                    "submitted_at": att.submitted_at,
                }
            )
        ser = LeaderboardEntrySerializer(results, many=True)
        return Response({"exam_id": exam.id, "results": ser.data})


class ExamAttemptViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExamAttemptSerializer

    def get_queryset(self):
        return ExamAttempt.objects.filter(user=self.request.user).select_related("exam")

    @action(detail=False, methods=["post"], url_path="start")
    def start(self, request):
        if request.user.role not in (UserRole.STUDENT, UserRole.TEACHER):
            return Response({"detail": "Sınava yalnızca öğrenci hesabıyla girilebilir."}, status=403)

        exam_id = request.data.get("exam_id")
        try:
            eid = int(exam_id)
        except (TypeError, ValueError):
            return Response({"detail": "exam_id geçersiz."}, status=400)

        exam = Exam.objects.filter(id=eid, is_published=True).first()
        if not exam:
            return Response({"detail": "Sınav bulunamadı."}, status=404)

        from subscriptions.models import InstitutionPackage

        if InstitutionPackage.objects.filter(is_active=True).exists():
            if not user_has_institution_feature(request.user, exams=True):
                return Response(
                    {
                        "detail": "Bu sınava girmek için aktif bir kurum paketine abone olmalısın.",
                        "code": "package_required",
                    },
                    status=403,
                )

        active = (
            ExamAttempt.objects.filter(
                exam=exam,
                user=request.user,
                status=AttemptStatus.IN_PROGRESS,
            )
            .first()
        )
        if active:
            finalize_attempt_if_expired(active)
            if active.status == AttemptStatus.IN_PROGRESS:
                return Response(ExamAttemptSerializer(active).data)

        now = timezone.now()
        ends = now + timedelta(minutes=max(1, exam.duration_minutes))
        attempt = ExamAttempt.objects.create(exam=exam, user=request.user, ends_at=ends)
        return Response(ExamAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"], url_path="status")
    def status_poll(self, request, pk=None):
        attempt = self.get_queryset().filter(pk=pk).first()
        if not attempt:
            return Response({"detail": "Oturum bulunamadı."}, status=404)
        finalize_attempt_if_expired(attempt)
        attempt.refresh_from_db()
        return Response(ExamAttemptSerializer(attempt).data)

    @action(detail=True, methods=["post"], url_path="answers")
    def save_answers(self, request, pk=None):
        attempt = self.get_queryset().filter(pk=pk).first()
        if not attempt:
            return Response({"detail": "Oturum bulunamadı."}, status=404)
        finalize_attempt_if_expired(attempt)
        if attempt.status != AttemptStatus.IN_PROGRESS:
            return Response({"detail": "Süre doldu veya sınav gönderildi."}, status=400)

        items = request.data.get("answers") or []
        if not isinstance(items, list):
            return Response({"detail": "answers listesi bekleniyor."}, status=400)

        q_ids = set(attempt.exam.questions.values_list("id", flat=True))
        for row in items:
            try:
                qid = int(row.get("question_id"))
            except (TypeError, ValueError):
                continue
            if qid not in q_ids:
                continue
            choice = str(row.get("choice") or "").strip().upper()[:1]
            ExamAnswer.objects.update_or_create(
                attempt=attempt,
                question_id=qid,
                defaults={"choice": choice},
            )
        return Response({"ok": True})

    @action(detail=True, methods=["post"], url_path="submit")
    def submit(self, request, pk=None):
        attempt = self.get_queryset().filter(pk=pk).first()
        if not attempt:
            return Response({"detail": "Oturum bulunamadı."}, status=404)
        finalize_attempt_if_expired(attempt)
        if attempt.status == AttemptStatus.IN_PROGRESS:
            submit_attempt(attempt)
        attempt.refresh_from_db()
        return Response(ExamAttemptSerializer(attempt).data)

    @action(detail=False, methods=["get"], url_path="my")
    def my_attempts(self, request):
        qs = self.get_queryset().order_by("-started_at")[:50]
        return Response(ExamAttemptSerializer(qs, many=True).data)


class TeacherExamManageViewSet(viewsets.ModelViewSet):
    """Öğretmen: sınav ve soru oluşturma (basit API)."""

    permission_classes = [IsAuthenticated, IsVerifiedTeacher]
    serializer_class = ExamDetailSerializer

    def get_queryset(self):
        return Exam.objects.filter(created_by=self.request.user).prefetch_related("questions")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, is_published=False)

    @action(detail=True, methods=["post"], url_path="questions")
    def add_question(self, request, pk=None):
        exam = self.get_object()
        ser_data = {
            "order_index": request.data.get("order_index", exam.questions.count()),
            "topic_slug": request.data.get("topic_slug", ""),
            "topic_title": request.data.get("topic_title", ""),
            "correct_choice": str(request.data.get("correct_choice", "A")).upper()[:1],
            "choice_count": int(request.data.get("choice_count", 5)),
        }
        q = ExamQuestion.objects.create(exam=exam, **ser_data)
        return Response({"id": q.id, **ser_data}, status=201)

    @action(detail=True, methods=["post"], url_path="publish")
    def publish(self, request, pk=None):
        exam = self.get_object()
        if exam.questions.count() == 0:
            return Response({"detail": "En az bir soru ekleyin."}, status=400)
        exam.is_published = True
        exam.save(update_fields=["is_published"])
        return Response({"ok": True, "is_published": True})
