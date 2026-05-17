from rest_framework import serializers

from .models import Exam, ExamAnswer, ExamAttempt, ExamQuestion


class ExamQuestionPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamQuestion
        fields = ["id", "order_index", "topic_slug", "topic_title", "choice_count"]


class ExamListSerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Exam
        fields = [
            "id",
            "title",
            "exam_type",
            "description",
            "duration_minutes",
            "is_published",
            "show_leaderboard",
            "question_count",
            "created_at",
        ]


class ExamDetailSerializer(serializers.ModelSerializer):
    questions = ExamQuestionPublicSerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = [
            "id",
            "title",
            "exam_type",
            "description",
            "duration_minutes",
            "negative_per_wrong",
            "is_published",
            "show_leaderboard",
            "questions",
            "created_at",
        ]


class ExamAttemptSerializer(serializers.ModelSerializer):
    exam_title = serializers.CharField(source="exam.title", read_only=True)
    remaining_seconds = serializers.SerializerMethodField()

    class Meta:
        model = ExamAttempt
        fields = [
            "id",
            "exam",
            "exam_title",
            "status",
            "started_at",
            "ends_at",
            "submitted_at",
            "remaining_seconds",
            "correct_count",
            "wrong_count",
            "blank_count",
            "net_score",
            "analysis_summary",
        ]
        read_only_fields = [
            "status",
            "started_at",
            "ends_at",
            "submitted_at",
            "correct_count",
            "wrong_count",
            "blank_count",
            "net_score",
            "analysis_summary",
        ]

    def get_remaining_seconds(self, obj: ExamAttempt) -> int:
        from django.utils import timezone

        if obj.status != "in_progress":
            return 0
        delta = obj.ends_at - timezone.now()
        return max(0, int(delta.total_seconds()))


class LeaderboardEntrySerializer(serializers.Serializer):
    rank = serializers.IntegerField()
    user_id = serializers.IntegerField()
    display_name = serializers.CharField()
    net_score = serializers.DecimalField(max_digits=8, decimal_places=2)
    correct_count = serializers.IntegerField()
    submitted_at = serializers.DateTimeField(allow_null=True)
