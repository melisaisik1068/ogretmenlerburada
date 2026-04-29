from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from accounts.permissions import IsVerifiedTeacher

from .models import Material
from .serializers import MaterialSerializer


class MaterialViewSet(viewsets.ModelViewSet):
    serializer_class = MaterialSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsVerifiedTeacher()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Material.objects.select_related("seller").order_by("-created_at")
        if self.action in ["list", "retrieve"]:
            return qs.filter(is_published=True)
        return qs.filter(seller=self.request.user)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

from django.shortcuts import render

# Create your views here.
