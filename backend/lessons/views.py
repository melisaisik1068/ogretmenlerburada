from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsVerifiedTeacher

from .models import Course, Lesson, Subject
from .permissions import HasCourseAccess
from .serializers import CourseSerializer, LessonSerializer, SubjectSerializer


class SubjectViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = SubjectSerializer
    queryset = Subject.objects.filter(is_active=True).order_by("title")


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated(), IsVerifiedTeacher()]

    def get_queryset(self):
        qs = Course.objects.select_related("teacher", "subject").prefetch_related("lessons")
        if self.action in ["list", "retrieve"]:
            return qs.filter(is_published=True)
        return qs.filter(teacher=self.request.user)

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        self.check_object_permissions(request, obj)
        return super().retrieve(request, *args, **kwargs)

    def get_object(self):
        obj = super().get_object()
        if self.action == "retrieve":
            # Public retrieve: access kontrolünü uygula
            HasCourseAccess().has_object_permission(self.request, self, obj) or self.permission_denied(
                self.request, message="Plan yetersiz. Yükseltme gerekli."
            )
        return obj

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsVerifiedTeacher])
    def add_lesson(self, request, pk=None):
        course = self.get_queryset().get(pk=pk)
        serializer = LessonSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course)
        return Response(serializer.data, status=201)


class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated(), IsVerifiedTeacher()]

    def get_queryset(self):
        qs = Lesson.objects.select_related("course", "course__teacher", "course__subject")
        if self.action in ["list", "retrieve"]:
            return qs.filter(is_published=True, course__is_published=True)
        return qs.filter(course__teacher=self.request.user)

from django.shortcuts import render

# Create your views here.
