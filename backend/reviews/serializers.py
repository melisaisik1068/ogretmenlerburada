from rest_framework import serializers

from accounts.serializers import UserPublicSerializer

from .models import CourseReview


class CourseReviewSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)

    class Meta:
        model = CourseReview
        fields = ["id", "user", "course", "rating", "comment", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def validate_rating(self, value: int) -> int:
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating 1-5 aralığında olmalı.")
        return value

