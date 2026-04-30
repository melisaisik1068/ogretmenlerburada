from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CourseReviewViewSet

router = DefaultRouter()
router.register("course-reviews", CourseReviewViewSet, basename="course-reviews")

urlpatterns = [path("", include(router.urls))]

