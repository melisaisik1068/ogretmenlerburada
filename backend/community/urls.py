from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CommunityCategoryViewSet, CommunityPostViewSet

router = DefaultRouter()
router.register("categories", CommunityCategoryViewSet, basename="community-categories")
router.register("posts", CommunityPostViewSet, basename="community-posts")

urlpatterns = [path("", include(router.urls))]

