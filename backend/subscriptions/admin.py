from django.contrib import admin

from .models import Subscription, SubscriptionPlan


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ["code", "title", "price_try", "is_active", "stripe_price_id"]
    list_filter = ["is_active", "code"]
    search_fields = ["code", "title", "stripe_price_id"]


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "plan", "provider", "status", "cancel_at_period_end", "current_period_end", "created_at"]
    list_filter = ["provider", "status", "cancel_at_period_end"]
    search_fields = ["user__username", "provider_customer_id", "provider_subscription_id"]
    raw_id_fields = ["user", "plan"]
