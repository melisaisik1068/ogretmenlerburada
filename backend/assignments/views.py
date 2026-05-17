from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import UserRole
from accounts.permissions import IsVerifiedTeacher

from .models import Homework, HomeworkSubmission, HomeworkStatus, SubmissionStatus
from .serializers import HomeworkSerializer, HomeworkSubmissionSerializer


class TeacherHomeworkViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsVerifiedTeacher]
    serializer_class = HomeworkSerializer

    def get_queryset(self):
        return (
            Homework.objects.filter(teacher=self.request.user)
            .annotate(submission_count=Count("submissions"))
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    @action(detail=True, methods=["get"])
    def submissions(self, request, pk=None):
        hw = self.get_object()
        qs = HomeworkSubmission.objects.filter(homework=hw).select_related("student")
        return Response(HomeworkSubmissionSerializer(qs, many=True, context={"request": request}).data)

    @action(detail=True, methods=["post"], url_path="review-submission")
    def review(self, request, pk=None):
        hw = self.get_object()
        try:
            sub_id = int(request.data.get("submission_id"))
        except (TypeError, ValueError):
            return Response({"detail": "submission_id geçersiz."}, status=400)
        sub = HomeworkSubmission.objects.filter(homework=hw, id=sub_id).first()
        if not sub:
            return Response({"detail": "Teslim bulunamadı."}, status=404)
        status_val = request.data.get("status", SubmissionStatus.REVIEWED)
        if status_val not in SubmissionStatus.values:
            status_val = SubmissionStatus.REVIEWED
        sub.status = status_val
        sub.teacher_feedback = str(request.data.get("teacher_feedback") or sub.teacher_feedback)
        sub.save(update_fields=["status", "teacher_feedback"])
        return Response(HomeworkSubmissionSerializer(sub, context={"request": request}).data)


class StudentHomeworkViewSet(viewsets.ReadOnlyModelViewSet):
    """Öğrenci: açık ödevleri listele."""

    permission_classes = [IsAuthenticated]
    serializer_class = HomeworkSerializer

    def get_queryset(self):
        return Homework.objects.filter(status=HomeworkStatus.OPEN).select_related("teacher").order_by("-created_at")

    @action(detail=True, methods=["post"], url_path="submit")
    def submit(self, request, pk=None):
        if request.user.role != UserRole.STUDENT:
            return Response({"detail": "Yalnızca öğrenci teslim edebilir."}, status=403)
        hw = self.get_object()
        if hw.status != HomeworkStatus.OPEN:
            return Response({"detail": "Ödev kapalı."}, status=400)
        photo = request.FILES.get("photo")
        if not photo:
            return Response({"detail": "Fotoğraf zorunlu."}, status=400)
        sub, created = HomeworkSubmission.objects.update_or_create(
            homework=hw,
            student=request.user,
            defaults={
                "photo": photo,
                "note": str(request.data.get("note") or ""),
                "status": SubmissionStatus.PENDING,
            },
        )
        return Response(
            HomeworkSubmissionSerializer(sub, context={"request": request}).data,
            status=201 if created else 200,
        )

    @action(detail=False, methods=["get"], url_path="my-submissions")
    def my_submissions(self, request):
        qs = HomeworkSubmission.objects.filter(student=request.user).select_related("homework")
        return Response(HomeworkSubmissionSerializer(qs, many=True, context={"request": request}).data)
