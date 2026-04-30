from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MeView, PublicTeachersView, RegisterView, TeacherVerificationDocumentViewSet

router = DefaultRouter()
router.register("teacher-documents", TeacherVerificationDocumentViewSet, basename="teacher-documents")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("teachers/", PublicTeachersView.as_view(), name="teachers"),
    path("", include(router.urls)),
]

