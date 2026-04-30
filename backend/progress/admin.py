from django.contrib import admin

from .models import LessonProgress


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ["user", "lesson", "is_completed", "progress_percent", "updated_at"]
    list_filter = ["is_completed"]
    search_fields = ["user__username", "lesson__title", "lesson__course__title"]

