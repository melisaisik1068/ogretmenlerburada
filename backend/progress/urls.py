from django.urls import path

from .views import CourseOutlineView, CourseProgressView, ProgressUpsertView

urlpatterns = [
    path("courses/<int:course_id>/", CourseProgressView.as_view(), name="course-progress"),
    path("courses/<int:course_id>/outline/", CourseOutlineView.as_view(), name="course-outline"),
    path("upsert/", ProgressUpsertView.as_view(), name="progress-upsert"),
]

