from rest_framework import serializers

from accounts.serializers import UserPublicSerializer

from .models import CommunityAnswer, CommunityCategory, CommunityPost


class CommunityCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityCategory
        fields = ["id", "slug", "title", "description"]


class CommunityPostSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)
    category_slug = serializers.SlugRelatedField(
        source="category", slug_field="slug", queryset=CommunityCategory.objects.all(), write_only=True
    )
    category = CommunityCategorySerializer(read_only=True)

    class Meta:
        model = CommunityPost
        fields = [
            "id",
            "author",
            "category",
            "category_slug",
            "type",
            "status",
            "title",
            "body",
            "created_at",
        ]
        read_only_fields = ["id", "author", "status", "created_at", "category"]


class CommunityAnswerSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)

    class Meta:
        model = CommunityAnswer
        fields = ["id", "post", "author", "body", "status", "created_at"]
        read_only_fields = ["id", "author", "status", "created_at"]

