from rest_framework import serializers

from accounts.serializers import UserPublicSerializer

from .models import Course, Lesson, Subject


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "slug", "title"]


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            "id",
            "course",
            "title",
            "duration_minutes",
            "price_try",
            "content",
            "video_url",
            "order_index",
            "is_preview",
            "is_published",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class CourseSerializer(serializers.ModelSerializer):
    teacher = UserPublicSerializer(read_only=True)
    subject_slug = serializers.SlugRelatedField(
        source="subject", slug_field="slug", queryset=Subject.objects.all(), write_only=True
    )
    subject = SubjectSerializer(read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    lessons_count = serializers.IntegerField(read_only=True)
    total_duration_minutes = serializers.IntegerField(read_only=True)
    min_price_try = serializers.IntegerField(read_only=True)
    rating_avg = serializers.FloatField(read_only=True)
    rating_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "teacher",
            "subject",
            "subject_slug",
            "title",
            "description",
            "cover_image_url",
            "access_level",
            "is_published",
            "created_at",
            "lessons",
            "lessons_count",
            "total_duration_minutes",
            "min_price_try",
            "rating_avg",
            "rating_count",
        ]
        read_only_fields = ["id", "teacher", "created_at", "subject", "lessons"]

