from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin as DjangoGroupAdmin, UserAdmin as DjangoUserAdmin
from django.contrib.auth.models import Group
from unfold.admin import ModelAdmin

from .models import TeacherVerificationDocument, User


if admin.site.is_registered(Group):
    admin.site.unregister(Group)


@admin.register(Group)
class GroupAdmin(ModelAdmin, DjangoGroupAdmin):
    pass


@admin.register(User)
class UserAdmin(ModelAdmin, DjangoUserAdmin):
    list_display = ("username", "email", "role", "teacher_verification_status", "is_active", "is_staff")
    list_filter = ("role", "teacher_verification_status", "is_active", "is_staff")
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("ÖğretmenlerBurada", {"fields": ("role", "bio", "avatar_url", "teacher_verification_status", "teacher_verified_at")}),
    )


@admin.register(TeacherVerificationDocument)
class TeacherVerificationDocumentAdmin(ModelAdmin):
    list_display = ("teacher", "original_filename", "created_at")
    search_fields = ("teacher__username", "teacher__email", "original_filename")
