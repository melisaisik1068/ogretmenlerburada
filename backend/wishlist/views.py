from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from lessons.models import Course
from marketplace.models import Material

from .models import CourseWishlist, MaterialWishlist
from .serializers import (
    CourseWishlistCreateSerializer,
    CourseWishlistItemSerializer,
    MaterialWishlistCreateSerializer,
    MaterialWishlistItemSerializer,
)


class CourseWishlistListCreateView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = CourseWishlist.objects.select_related("course", "course__teacher", "course__subject").prefetch_related(
            "course__lessons"
        ).filter(user=request.user)
        return Response(CourseWishlistItemSerializer(qs, many=True).data)

    def post(self, request):
        ser = CourseWishlistCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        course = generics.get_object_or_404(Course, pk=ser.validated_data["course_id"])
        obj, created = CourseWishlist.objects.get_or_create(user=request.user, course=course)
        return Response({"ok": True, "created": created}, status=201 if created else 200)


class CourseWishlistDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, course_id: int):
        CourseWishlist.objects.filter(user=request.user, course_id=course_id).delete()
        return Response({"ok": True})


class MaterialWishlistListCreateView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = MaterialWishlist.objects.select_related("material", "material__seller").filter(user=request.user)
        return Response(MaterialWishlistItemSerializer(qs, many=True).data)

    def post(self, request):
        ser = MaterialWishlistCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        material = generics.get_object_or_404(Material, pk=ser.validated_data["material_id"])
        obj, created = MaterialWishlist.objects.get_or_create(user=request.user, material=material)
        return Response({"ok": True, "created": created}, status=201 if created else 200)


class MaterialWishlistDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, material_id: int):
        MaterialWishlist.objects.filter(user=request.user, material_id=material_id).delete()
        return Response({"ok": True})

