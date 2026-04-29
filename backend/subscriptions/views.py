from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Subscription, SubscriptionPlan
from .serializers import SubscriptionPlanSerializer, SubscriptionSerializer


class PlanListView(generics.ListAPIView):
    serializer_class = SubscriptionPlanSerializer

    def get_queryset(self):
        return SubscriptionPlan.objects.filter(is_active=True).order_by("price_try")


class MySubscriptionView(APIView):
    """Abonelik yokken 200 + plan=null döner (middleware / frontend için güvenli)."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        sub = (
            Subscription.objects.filter(user=request.user)
            .select_related("plan")
            .order_by("-created_at")
            .first()
        )
        if sub is None:
            return Response({"subscription": None, "plan": None})
        return Response(SubscriptionSerializer(sub).data)
