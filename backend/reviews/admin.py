from django.contrib import admin

from .models import CourseReview


@admin.register(CourseReview)
class CourseReviewAdmin(admin.ModelAdmin):
    list_display = ["course", "user", "rating", "created_at"]
    list_filter = ["rating"]
    search_fields = ["course__title", "user__username", "comment"]

