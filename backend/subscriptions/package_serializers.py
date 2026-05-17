from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers

from .models import InstitutionPackage, StudentPackageSubscription, SubscriptionStatus


class InstitutionPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstitutionPackage
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "price_try",
            "billing_cycle_days",
            "includes_premium_courses",
            "includes_all_exams",
            "includes_marketplace",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class StudentPackageSubscriptionSerializer(serializers.ModelSerializer):
    package = InstitutionPackageSerializer(read_only=True)

    class Meta:
        model = StudentPackageSubscription
        fields = ["id", "package", "status", "current_period_end", "created_at", "is_active"]
        read_only_fields = fields

    is_active = serializers.BooleanField(read_only=True)
