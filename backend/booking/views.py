from django.contrib.auth import get_user_model
from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsStudent, IsTeacher

from .models import Appointment, AppointmentStatus, TeacherAvailability
from .serializers import AppointmentSerializer, TeacherAvailabilitySerializer

User = get_user_model()


class TeacherAvailabilityViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsTeacher]
    serializer_class = TeacherAvailabilitySerializer

    def get_queryset(self):
        return TeacherAvailability.objects.filter(teacher=self.request.user)

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class AppointmentViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = AppointmentSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated(), IsStudent()]
        return [IsAuthenticated()]

    def get_queryset(self):
        u = self.request.user
        return Appointment.objects.filter(teacher=u) if getattr(u, "role", None) == "teacher" else Appointment.objects.filter(student=u)

    def perform_create(self, serializer):
        teacher = User.objects.get(id=serializer.validated_data["teacher_id"])
        serializer.save(teacher=teacher, student=self.request.user, status=AppointmentStatus.PENDING)

from django.shortcuts import render

# Create your views here.
