from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Subscription, SubscriptionPlan
from .serializers import SubscriptionPlanSerializer, SubscriptionSerializer


class PlanListView(generics.ListAPIView):
    serializer_class = SubscriptionPlanSerializer

    def get_queryset(self):
        return SubscriptionPlan.objects.filter(is_active=True).order_by("price_try")


class MySubscriptionView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def get_object(self):
        # 1 aktif abonelik varsayımı (MVP)
        return (
            Subscription.objects.filter(user=self.request.user)
            .select_related("plan")
            .order_by("-created_at")
            .first()
        )

from django.shortcuts import render

# Create your views here.
