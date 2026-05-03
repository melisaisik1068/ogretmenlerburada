from rest_framework import serializers

from accounts.serializers import UserPublicSerializer

from .models import CommunityAnswer, CommunityCategory, CommunityPost, CommunityPostStatus, CommunityPostType


class CommunityCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityCategory
        fields = ["id", "slug", "title", "description"]


class CommunityAnswerReadSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)

    class Meta:
        model = CommunityAnswer
        fields = ["id", "author", "body", "status", "is_accepted", "created_at"]
        read_only_fields = ["id", "author", "body", "status", "is_accepted", "created_at"]


class CommunityAnswerCreateSerializer(serializers.ModelSerializer):
    post = serializers.PrimaryKeyRelatedField(queryset=CommunityPost.objects.all())

    class Meta:
        model = CommunityAnswer
        fields = ["post", "body"]

    def validate_post(self, value: CommunityPost):
        if value.status != CommunityPostStatus.APPROVED:
            raise serializers.ValidationError("Yalnızca onaylı gönderilere cevap yazılabilir.")
        if value.type != CommunityPostType.QUESTION:
            raise serializers.ValidationError("Yalnızca soru tipindeki gönderilere cevap yazılabilir.")
        return value


class CommunityPostListSerializer(serializers.ModelSerializer):
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


class CommunityPostDetailSerializer(CommunityPostListSerializer):
    answers = serializers.SerializerMethodField()

    class Meta(CommunityPostListSerializer.Meta):
        fields = CommunityPostListSerializer.Meta.fields + ["answers"]

    def get_answers(self, obj: CommunityPost):
        qs = (
            obj.answers.filter(status=CommunityPostStatus.APPROVED)
            .select_related("author")
            .order_by("-is_accepted", "created_at")
        )
        return CommunityAnswerReadSerializer(qs, many=True, context=self.context).data
