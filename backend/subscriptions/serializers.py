from rest_framework import serializers

from .models import Subscription, SubscriptionPlan


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ["code", "title", "price_try", "billing_cycle_days", "is_active"]


class SubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = [
            "id",
            "plan",
            "provider",
            "status",
            "current_period_start",
            "current_period_end",
            "cancel_at_period_end",
        ]

