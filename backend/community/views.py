from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from .models import CommunityCategory, CommunityPost, CommunityPostStatus
from .serializers import CommunityCategorySerializer, CommunityPostSerializer


class CommunityCategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = CommunityCategorySerializer
    queryset = CommunityCategory.objects.filter(is_active=True).order_by("title")


class CommunityPostViewSet(viewsets.ModelViewSet):
    serializer_class = CommunityPostSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = CommunityPost.objects.select_related("author", "category").order_by("-created_at")
        if self.action in ["list", "retrieve"]:
            qs = qs.filter(status=CommunityPostStatus.APPROVED)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, status=CommunityPostStatus.PENDING)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        if not request.user.is_staff:
            self.permission_denied(request, message="Sadece admin/moderator onaylayabilir.")
        post = CommunityPost.objects.get(pk=pk)
        post.status = CommunityPostStatus.APPROVED
        post.approved_by = request.user
        post.approved_at = timezone.now()
        post.save(update_fields=["status", "approved_by", "approved_at", "updated_at"])
        return Response(self.get_serializer(post).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        if not request.user.is_staff:
            self.permission_denied(request, message="Sadece admin/moderator reddedebilir.")
        post = CommunityPost.objects.get(pk=pk)
        post.status = CommunityPostStatus.REJECTED
        post.approved_by = request.user
        post.approved_at = timezone.now()
        post.save(update_fields=["status", "approved_by", "approved_at", "updated_at"])
        return Response(self.get_serializer(post).data)
