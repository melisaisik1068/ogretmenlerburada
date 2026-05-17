from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import Exam, ExamAnswer, ExamAttempt, ExamQuestion


class ExamQuestionInline(TabularInline):
    model = ExamQuestion
    extra = 0


@admin.register(Exam)
class ExamAdmin(ModelAdmin):
    list_display = ("title", "exam_type", "duration_minutes", "is_published", "created_at")
    list_filter = ("exam_type", "is_published")
    inlines = [ExamQuestionInline]


@admin.register(ExamAttempt)
class ExamAttemptAdmin(ModelAdmin):
    list_display = ("exam", "user", "status", "net_score", "started_at", "submitted_at")
    list_filter = ("status", "exam")


@admin.register(ExamAnswer)
class ExamAnswerAdmin(ModelAdmin):
    list_display = ("attempt", "question", "choice")
