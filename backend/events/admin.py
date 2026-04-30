from django.contrib import admin

from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "is_published", "starts_at", "created_at"]
    list_filter = ["is_published"]
    search_fields = ["title", "slug", "location", "description"]
    prepopulated_fields = {"slug": ("title",)}

