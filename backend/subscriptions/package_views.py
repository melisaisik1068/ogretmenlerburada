from datetime import timedelta

from django.utils import timezone
from django.utils.text import slugify
from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsVerifiedTeacher

from .models import InstitutionPackage, StudentPackageSubscription, SubscriptionStatus
from .package_serializers import InstitutionPackageSerializer, StudentPackageSubscriptionSerializer


class InstitutionPackageListView(generics.ListAPIView):
    """Öğrencilerin satın alabileceği aktif kurum paketleri."""

    permission_classes = [AllowAny]
    serializer_class = InstitutionPackageSerializer

    def get_queryset(self):
        return InstitutionPackage.objects.filter(is_active=True).order_by("price_try")


class TeacherInstitutionPackageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsVerifiedTeacher]
    serializer_class = InstitutionPackageSerializer

    def get_queryset(self):
        return InstitutionPackage.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        title = serializer.validated_data.get("title", "paket")
        base_slug = slugify(title)[:60] or "paket"
        slug = base_slug
        n = 1
        while InstitutionPackage.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{n}"
            n += 1
        serializer.save(owner=self.request.user, slug=slug)


class MyStudentPackageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sub = (
            StudentPackageSubscription.objects.filter(user=request.user)
            .select_related("package")
            .order_by("-created_at")
            .first()
        )
        if not sub:
            return Response({"subscription": None})
        return Response(StudentPackageSubscriptionSerializer(sub).data)


class SubscribeInstitutionPackageView(APIView):
    """Manuel abonelik (ödeme entegrasyonu sonra bağlanır)."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        slug = (request.data.get("slug") or "").strip()
        pkg = InstitutionPackage.objects.filter(slug=slug, is_active=True).first()
        if not pkg:
            return Response({"detail": "Paket bulunamadı."}, status=404)

        now = timezone.now()
        end = now + timedelta(days=max(1, pkg.billing_cycle_days))
        sub, _ = StudentPackageSubscription.objects.update_or_create(
            user=request.user,
            package=pkg,
            defaults={
                "status": SubscriptionStatus.ACTIVE,
                "current_period_end": end,
            },
        )
        return Response(StudentPackageSubscriptionSerializer(sub).data)
