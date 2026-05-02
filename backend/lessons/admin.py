from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import Course, Lesson, Subject


class LessonInline(TabularInline):
    model = Lesson
    extra = 0
    ordering = ("order_index", "id")


@admin.register(Subject)
class SubjectAdmin(ModelAdmin):
    list_display = ("title", "slug", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "slug")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Course)
class CourseAdmin(ModelAdmin):
    list_display = ("title", "teacher", "subject", "access_level", "is_published", "created_at")
    list_filter = ("is_published", "access_level", "subject")
    search_fields = ("title", "description", "teacher__username")
    raw_id_fields = ("teacher", "subject")
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(ModelAdmin):
    list_display = ("title", "course", "order_index", "duration_minutes", "price_try", "is_preview", "is_published")
    list_filter = ("is_published", "is_preview", "course__subject")
    search_fields = ("title", "course__title")
    raw_id_fields = ("course",)
    ordering = ("course", "order_index", "id")
