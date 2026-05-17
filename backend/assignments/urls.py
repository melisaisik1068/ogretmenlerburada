from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import StudentHomeworkViewSet, TeacherHomeworkViewSet

router = DefaultRouter()
router.register(r"teacher/homeworks", TeacherHomeworkViewSet, basename="teacher-homework")
router.register(r"homeworks", StudentHomeworkViewSet, basename="student-homework")

urlpatterns = [
    path("", include(router.urls)),
]
