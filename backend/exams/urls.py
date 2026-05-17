from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ExamAttemptViewSet, ExamViewSet, TeacherExamManageViewSet

router = DefaultRouter()
router.register(r"exams", ExamViewSet, basename="exam")
router.register(r"attempts", ExamAttemptViewSet, basename="exam-attempt")
router.register(r"teacher/exams", TeacherExamManageViewSet, basename="teacher-exam")

urlpatterns = [
    path("", include(router.urls)),
]
