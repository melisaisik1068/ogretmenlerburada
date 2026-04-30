from django.contrib import admin

from .models import CourseWishlist, MaterialWishlist


@admin.register(CourseWishlist)
class CourseWishlistAdmin(admin.ModelAdmin):
    list_display = ["user", "course", "created_at"]
    search_fields = ["user__username", "course__title"]


@admin.register(MaterialWishlist)
class MaterialWishlistAdmin(admin.ModelAdmin):
    list_display = ["user", "material", "created_at"]
    search_fields = ["user__username", "material__title"]

