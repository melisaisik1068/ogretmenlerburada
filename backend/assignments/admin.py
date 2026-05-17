from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Homework, HomeworkSubmission


@admin.register(Homework)
class HomeworkAdmin(ModelAdmin):
    list_display = ("title", "teacher", "status", "due_at", "created_at")
    list_filter = ("status",)


@admin.register(HomeworkSubmission)
class HomeworkSubmissionAdmin(ModelAdmin):
    list_display = ("homework", "student", "status", "submitted_at")
    list_filter = ("status",)
