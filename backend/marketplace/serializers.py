from rest_framework import serializers

from accounts.serializers import UserPublicSerializer

from .models import Material, MaterialAccess


class MaterialSerializer(serializers.ModelSerializer):
    seller = UserPublicSerializer(read_only=True)

    class Meta:
        model = Material
        fields = ["id", "seller", "title", "description", "type", "file", "price_try", "is_published", "created_at"]
        read_only_fields = ["id", "seller", "created_at"]


class MaterialAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialAccess
        fields = ["id", "material", "granted_at"]
        read_only_fields = ["id", "granted_at"]

