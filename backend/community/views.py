from django.utils import timezone
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import CommunityAnswer, CommunityCategory, CommunityPost, CommunityPostStatus, CommunityPostType
from .serializers import (
    CommunityAnswerCreateSerializer,
    CommunityAnswerReadSerializer,
    CommunityCategorySerializer,
    CommunityPostDetailSerializer,
    CommunityPostListSerializer,
)


class CommunityCategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = CommunityCategorySerializer
    queryset = CommunityCategory.objects.filter(is_active=True).order_by("title")


class CommunityPostViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.action == "retrieve":
            return CommunityPostDetailSerializer
        return CommunityPostListSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = (
            CommunityPost.objects.select_related("author", "category")
            .prefetch_related("answers__author")
            .order_by("-created_at")
        )
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
        return Response(CommunityPostListSerializer(post, context={"request": request}).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        if not request.user.is_staff:
            self.permission_denied(request, message="Sadece admin/moderator reddedebilir.")
        post = CommunityPost.objects.get(pk=pk)
        post.status = CommunityPostStatus.REJECTED
        post.approved_by = request.user
        post.approved_at = timezone.now()
        post.save(update_fields=["status", "approved_by", "approved_at", "updated_at"])
        return Response(CommunityPostListSerializer(post, context={"request": request}).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated], url_path="accept-answer")
    def accept_answer(self, request, pk=None):
        post = self.get_object()
        if post.type != CommunityPostType.QUESTION:
            return Response({"detail": "Yalnızca soru gönderilerinde en iyi cevap seçilebilir."}, status=400)
        if post.author_id != request.user.id and not request.user.is_staff:
            self.permission_denied(request, message="Yalnızca gönderi sahibi veya moderatör bunu yapabilir.")
        answer_id = request.data.get("answer")
        if answer_id is None:
            return Response({"detail": "answer alanı (cevap kimliği) zorunludur."}, status=400)
        try:
            answer = CommunityAnswer.objects.get(pk=int(answer_id), post_id=post.pk)
        except (CommunityAnswer.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Cevap bulunamadı."}, status=404)
        if answer.status != CommunityPostStatus.APPROVED:
            return Response({"detail": "Yalnızca onaylı cevaplar seçilebilir."}, status=400)
        CommunityAnswer.objects.filter(post_id=post.pk, is_accepted=True).update(is_accepted=False)
        answer.is_accepted = True
        answer.save(update_fields=["is_accepted"])
        serializer = CommunityPostDetailSerializer(post, context={"request": request})
        return Response(serializer.data)


class CommunityAnswerViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.action == "create":
            return CommunityAnswerCreateSerializer
        return CommunityAnswerReadSerializer

    def get_queryset(self):
        qs = CommunityAnswer.objects.select_related("author", "post").order_by("-is_accepted", "created_at")
        if self.action == "list":
            post_id = self.request.query_params.get("post")
            if not post_id:
                return CommunityAnswer.objects.none()
            qs = qs.filter(post_id=post_id)
            if not getattr(self.request.user, "is_staff", False):
                qs = qs.filter(status=CommunityPostStatus.APPROVED)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, status=CommunityPostStatus.PENDING)
