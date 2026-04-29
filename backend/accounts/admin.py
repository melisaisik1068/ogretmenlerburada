from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import TeacherVerificationDocument, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("username", "email", "role", "teacher_verification_status", "is_active", "is_staff")
    list_filter = ("role", "teacher_verification_status", "is_active", "is_staff")
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("ÖğretmenlerBurada", {"fields": ("role", "bio", "avatar_url", "teacher_verification_status", "teacher_verified_at")}),
    )


@admin.register(TeacherVerificationDocument)
class TeacherVerificationDocumentAdmin(admin.ModelAdmin):
    list_display = ("teacher", "original_filename", "created_at")
    search_fields = ("teacher__username", "teacher__email", "original_filename")
