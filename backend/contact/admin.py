from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import ContactMessage, NewsletterSubscriber


@admin.register(ContactMessage)
class ContactMessageAdmin(ModelAdmin):
    list_display = ["email", "name", "created_at"]
    search_fields = ["email", "name"]


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(ModelAdmin):
    list_display = ["email", "created_at"]
    search_fields = ["email"]
