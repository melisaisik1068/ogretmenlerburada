from django.db.models import Avg, Count, Min, Q, Sum, Value
from django.db.models.functions import Coalesce
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

    def _with_public_annotations(self, qs):
        # published lessons only for aggregates
        lesson_filter = Q(lessons__is_published=True)
        return qs.annotate(
            lessons_count=Count("lessons", filter=lesson_filter, distinct=True),
            total_duration_minutes=Coalesce(Sum("lessons__duration_minutes", filter=lesson_filter), Value(0)),
            min_price_try=Coalesce(Min("lessons__price_try", filter=lesson_filter), Value(0)),
            rating_avg=Coalesce(Avg("reviews__rating"), Value(0.0)),
            rating_count=Count("reviews", distinct=True),
        )

    def get_queryset(self):
        qs = Course.objects.select_related("teacher", "subject").prefetch_related("lessons")
        if self.action in ["list", "retrieve"]:
            qs = qs.filter(is_published=True)
            qs = self._with_public_annotations(qs)

            params = self.request.query_params
            q = (params.get("q") or "").strip()
            subject = (params.get("subject") or "").strip()
            teacher = (params.get("teacher") or "").strip()
            level = (params.get("level") or "").strip()
            price_min = params.get("price_min")
            price_max = params.get("price_max")
            duration_min = params.get("duration_min")
            duration_max = params.get("duration_max")
            sort = (params.get("sort") or "newest").strip()

            if q:
                qs = qs.filter(
                    Q(title__icontains=q)
                    | Q(description__icontains=q)
                    | Q(subject__title__icontains=q)
                    | Q(teacher__username__icontains=q)
                    | Q(teacher__first_name__icontains=q)
                    | Q(teacher__last_name__icontains=q)
                )
            if subject:
                qs = qs.filter(subject__slug=subject)
            if teacher:
                if teacher.isdigit():
                    qs = qs.filter(teacher_id=int(teacher))
                else:
                    qs = qs.filter(teacher__username__iexact=teacher)
            if level:
                qs = qs.filter(access_level=level)

            def _to_int(v):
                try:
                    return int(v)
                except Exception:
                    return None

            pmin = _to_int(price_min)
            pmax = _to_int(price_max)
            dmin = _to_int(duration_min)
            dmax = _to_int(duration_max)
            if pmin is not None:
                qs = qs.filter(min_price_try__gte=pmin)
            if pmax is not None:
                qs = qs.filter(min_price_try__lte=pmax)
            if dmin is not None:
                qs = qs.filter(total_duration_minutes__gte=dmin)
            if dmax is not None:
                qs = qs.filter(total_duration_minutes__lte=dmax)

            if sort == "oldest":
                qs = qs.order_by("created_at")
            elif sort == "duration_desc":
                qs = qs.order_by("-total_duration_minutes", "-created_at")
            elif sort == "price_asc":
                qs = qs.order_by("min_price_try", "-created_at")
            elif sort == "price_desc":
                qs = qs.order_by("-min_price_try", "-created_at")
            else:  # newest
                qs = qs.order_by("-created_at")

            return qs
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

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, IsVerifiedTeacher])
    def mine(self, request):
        qs = Course.objects.select_related("teacher", "subject").prefetch_related("lessons").filter(teacher=request.user)
        qs = self._with_public_annotations(qs)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


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

    def get_object(self):
        obj = super().get_object()
        if self.action == "retrieve":
            # Allow preview lessons publicly; otherwise require course access.
            if obj.is_preview:
                return obj
            HasCourseAccess().has_object_permission(self.request, self, obj.course) or self.permission_denied(
                self.request, message="Plan yetersiz. Yükseltme gerekli."
            )
        return obj

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, IsVerifiedTeacher])
    def mine(self, request):
        qs = Lesson.objects.select_related("course", "course__teacher", "course__subject").filter(course__teacher=request.user)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

from django.shortcuts import render

# Create your views here.
