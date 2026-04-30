from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import BlogPost
from .serializers import BlogPostDetailSerializer, BlogPostListSerializer


class BlogPostViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        qs = BlogPost.objects.order_by("-published_at", "-created_at")
        # Public only
        return qs.filter(is_published=True)

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BlogPostDetailSerializer
        return BlogPostListSerializer


class BlogPostAdminViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD (optional): keep it protected.
    If you don't want API writes, remove this from urls.
    """

    permission_classes = [IsAuthenticated]
    queryset = BlogPost.objects.all().order_by("-published_at", "-created_at")
    serializer_class = BlogPostDetailSerializer
    lookup_field = "slug"

