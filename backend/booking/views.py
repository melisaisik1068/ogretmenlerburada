from django.contrib.auth import get_user_model
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsStudent, IsTeacher

from .models import Appointment, AppointmentStatus, TeacherAvailability
from .serializers import (
    AppointmentCreateSerializer,
    AppointmentListSerializer,
    AppointmentPatchSerializer,
    TeacherAvailabilitySerializer,
)

User = get_user_model()


class TeacherAvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = TeacherAvailabilitySerializer

    def get_permissions(self):
        if getattr(self, "action", None) == "public_slots":
            return [AllowAny()]
        return [IsAuthenticated(), IsTeacher()]

    def get_queryset(self):
        if getattr(self, "action", None) == "public_slots":
            tid = self.request.query_params.get("teacher")
            if not tid:
                return TeacherAvailability.objects.none()
            return TeacherAvailability.objects.filter(teacher_id=tid, is_active=True).order_by("weekday", "start_time")
        return TeacherAvailability.objects.filter(teacher=self.request.user).order_by("weekday", "start_time")

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    @action(detail=False, methods=["get"], permission_classes=[AllowAny], url_path="public-slots")
    def public_slots(self, request):
        qs = self.get_queryset()
        return Response(TeacherAvailabilitySerializer(qs, many=True).data)


class AppointmentViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_serializer_class(self):
        if self.action == "create":
            return AppointmentCreateSerializer
        if self.action in ("partial_update", "update"):
            return AppointmentPatchSerializer
        return AppointmentListSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated(), IsStudent()]
        return [IsAuthenticated()]

    def get_queryset(self):
        u = self.request.user
        base = Appointment.objects.select_related("teacher", "student")
        if getattr(u, "role", None) == "teacher":
            return base.filter(teacher=u).order_by("-starts_at")
        return base.filter(student=u).order_by("-starts_at")

    def perform_create(self, serializer):
        teacher_id = serializer.validated_data.pop("teacher_id")
        teacher = User.objects.get(pk=teacher_id)
        serializer.save(
            teacher=teacher,
            student=self.request.user,
            status=AppointmentStatus.PENDING,
        )
