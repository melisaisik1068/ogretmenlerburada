from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from lessons.models import Lesson
from lessons.permissions import HasCourseAccess

from .models import LessonProgress
from .serializers import LessonProgressSerializer, LessonProgressUpsertSerializer


class CourseProgressView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id: int):
        qs = LessonProgress.objects.select_related("lesson").filter(user=request.user, lesson__course_id=course_id)
        return Response(LessonProgressSerializer(qs, many=True).data)


class ProgressUpsertView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ser = LessonProgressUpsertSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        lesson = generics.get_object_or_404(
            Lesson.objects.select_related("course", "course__teacher", "course__subject"),
            pk=ser.validated_data["lesson_id"],
        )

        # Enforce course access for progress writes
        HasCourseAccess().has_object_permission(request, self, lesson.course) or self.permission_denied(
            request, message="Plan yetersiz. Yükseltme gerekli."
        )

        obj, _ = LessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
        if "is_completed" in ser.validated_data:
            obj.is_completed = ser.validated_data["is_completed"]
        if "progress_percent" in ser.validated_data:
            obj.progress_percent = int(ser.validated_data["progress_percent"])
        obj.save()
        return Response({"ok": True})


class CourseOutlineView(generics.GenericAPIView):
    """
    Returns ordered lessons with locked/completed flags for current user.
    Preview lessons are always unlocked.
    Sequential locking: non-preview lesson i is unlocked only if all previous lessons completed.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id: int):
        lessons = (
            Lesson.objects.select_related("course")
            .filter(course_id=course_id, is_published=True, course__is_published=True)
            .order_by("order_index", "id")
        )

        # Require course access for full outline (except previews are visible but locked state still computed)
        if lessons:
            HasCourseAccess().has_object_permission(request, self, lessons[0].course) or self.permission_denied(
                request, message="Plan yetersiz. Yükseltme gerekli."
            )

        rows = LessonProgress.objects.filter(user=request.user, lesson__course_id=course_id)
        completed = {r.lesson_id for r in rows if r.is_completed}

        out = []
        prev_all_done = True
        for l in lessons:
            is_completed = l.id in completed
            locked = False
            if not l.is_preview and not prev_all_done:
                locked = True
            if not l.is_preview and not is_completed:
                prev_all_done = False
            out.append(
                {
                    "id": l.id,
                    "title": l.title,
                    "order_index": l.order_index,
                    "duration_minutes": l.duration_minutes,
                    "price_try": l.price_try,
                    "is_preview": l.is_preview,
                    "is_completed": is_completed,
                    "locked": locked,
                }
            )
        return Response(out)

