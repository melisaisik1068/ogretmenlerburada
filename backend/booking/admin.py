from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Appointment, TeacherAvailability


@admin.register(TeacherAvailability)
class TeacherAvailabilityAdmin(ModelAdmin):
    list_display = ("id", "teacher", "weekday", "start_time", "end_time", "is_active")
    list_filter = ("weekday", "is_active")
    search_fields = ("teacher__username", "teacher__email")
    raw_id_fields = ("teacher",)


@admin.register(Appointment)
class AppointmentAdmin(ModelAdmin):
    list_display = ("id", "teacher", "student", "starts_at", "ends_at", "status", "meeting_url", "created_at")
    list_filter = ("status",)
    search_fields = ("teacher__username", "student__username", "note")
    raw_id_fields = ("teacher", "student")
    ordering = ("-starts_at",)
