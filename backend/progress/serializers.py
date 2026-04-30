from rest_framework import serializers

from .models import LessonProgress


class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_id = serializers.IntegerField(source="lesson.id", read_only=True)
    course_id = serializers.IntegerField(source="lesson.course_id", read_only=True)

    class Meta:
        model = LessonProgress
        fields = ["lesson_id", "course_id", "is_completed", "progress_percent", "updated_at"]


class LessonProgressUpsertSerializer(serializers.Serializer):
    lesson_id = serializers.IntegerField()
    is_completed = serializers.BooleanField(required=False)
    progress_percent = serializers.IntegerField(min_value=0, max_value=100, required=False)

