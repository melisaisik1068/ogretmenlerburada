from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AppointmentViewSet, TeacherAvailabilityViewSet

router = DefaultRouter()
router.register("availabilities", TeacherAvailabilityViewSet, basename="availabilities")
router.register("appointments", AppointmentViewSet, basename="appointments")

urlpatterns = [path("", include(router.urls))]

