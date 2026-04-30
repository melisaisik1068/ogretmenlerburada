from rest_framework import serializers

from lessons.serializers import CourseSerializer
from marketplace.serializers import MaterialSerializer

from .models import CourseWishlist, MaterialWishlist


class CourseWishlistCreateSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()


class CourseWishlistItemSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = CourseWishlist
        fields = ["course", "created_at"]


class MaterialWishlistCreateSerializer(serializers.Serializer):
    material_id = serializers.IntegerField()


class MaterialWishlistItemSerializer(serializers.ModelSerializer):
    material = MaterialSerializer(read_only=True)

    class Meta:
        model = MaterialWishlist
        fields = ["material", "created_at"]

