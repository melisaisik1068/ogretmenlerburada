from django.contrib import admin
from django.utils import timezone

from .models import (
    CommunityAnswer,
    CommunityCategory,
    CommunityPost,
    CommunityPostStatus,
)


@admin.register(CommunityCategory)
class CommunityCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_active")
    search_fields = ("title", "slug")
    list_filter = ("is_active",)


@admin.action(description="Seçili postları onayla (approved)")
def approve_posts(modeladmin, request, queryset):
    queryset.update(status=CommunityPostStatus.APPROVED, approved_by=request.user, approved_at=timezone.now())


@admin.action(description="Seçili postları reddet (rejected)")
def reject_posts(modeladmin, request, queryset):
    queryset.update(status=CommunityPostStatus.REJECTED, approved_by=request.user, approved_at=timezone.now())


@admin.register(CommunityPost)
class CommunityPostAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "type", "status", "author", "created_at")
    search_fields = ("title", "body", "author__username")
    list_filter = ("status", "type", "category")
    actions = [approve_posts, reject_posts]


@admin.action(description="Seçili cevapları onayla (approved)")
def approve_answers(modeladmin, request, queryset):
    queryset.update(status=CommunityPostStatus.APPROVED, approved_by=request.user, approved_at=timezone.now())


@admin.action(description="Seçili cevapları reddet (rejected)")
def reject_answers(modeladmin, request, queryset):
    queryset.update(status=CommunityPostStatus.REJECTED, approved_by=request.user, approved_at=timezone.now())


@admin.register(CommunityAnswer)
class CommunityAnswerAdmin(admin.ModelAdmin):
    list_display = ("post", "author", "status", "created_at")
    search_fields = ("body", "author__username", "post__title")
    list_filter = ("status",)
    actions = [approve_answers, reject_answers]
