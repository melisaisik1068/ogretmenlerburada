from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import InstitutionPackage, StudentPackageSubscription, Subscription, SubscriptionPlan


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(ModelAdmin):
    list_display = ["code", "title", "price_try", "billing_cycle_days", "is_active", "stripe_price_id"]
    list_filter = ["is_active", "code"]
    search_fields = ["code", "title", "stripe_price_id"]


@admin.register(Subscription)
class SubscriptionAdmin(ModelAdmin):
    list_display = ["id", "user", "plan", "provider", "status", "cancel_at_period_end", "current_period_end", "created_at"]
    list_filter = ["provider", "status", "cancel_at_period_end"]
    search_fields = ["user__username", "provider_customer_id", "provider_subscription_id"]
    raw_id_fields = ["user", "plan"]


@admin.register(InstitutionPackage)
class InstitutionPackageAdmin(ModelAdmin):
    list_display = ("title", "slug", "owner", "price_try", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title", "slug", "owner__username")


@admin.register(StudentPackageSubscription)
class StudentPackageSubscriptionAdmin(ModelAdmin):
    list_display = ("user", "package", "status", "current_period_end", "created_at")
    list_filter = ("status",)
    raw_id_fields = ("user", "package")
