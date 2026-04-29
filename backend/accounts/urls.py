from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MeView, RegisterView, TeacherVerificationDocumentViewSet

router = DefaultRouter()
router.register("teacher-documents", TeacherVerificationDocumentViewSet, basename="teacher-documents")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("", include(router.urls)),
]

