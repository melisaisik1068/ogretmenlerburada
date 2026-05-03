from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CommunityAnswerViewSet, CommunityCategoryViewSet, CommunityPostViewSet

router = DefaultRouter()
router.register("categories", CommunityCategoryViewSet, basename="community-categories")
router.register("posts", CommunityPostViewSet, basename="community-posts")
router.register("answers", CommunityAnswerViewSet, basename="community-answers")

urlpatterns = [path("", include(router.urls))]

