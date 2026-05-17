from rest_framework import serializers

from .models import Homework, HomeworkSubmission


class HomeworkSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    submission_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Homework
        fields = [
            "id",
            "title",
            "description",
            "due_at",
            "status",
            "teacher",
            "teacher_name",
            "submission_count",
            "created_at",
        ]
        read_only_fields = ["teacher", "created_at"]

    def get_teacher_name(self, obj: Homework) -> str:
        u = obj.teacher
        return f"{u.first_name} {u.last_name}".strip() or u.username


class HomeworkSubmissionSerializer(serializers.ModelSerializer):
    homework_title = serializers.CharField(source="homework.title", read_only=True)
    student_name = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()

    class Meta:
        model = HomeworkSubmission
        fields = [
            "id",
            "homework",
            "homework_title",
            "student",
            "student_name",
            "photo",
            "note",
            "status",
            "teacher_feedback",
            "submitted_at",
        ]
        read_only_fields = ["student", "submitted_at", "status", "teacher_feedback"]

    def get_student_name(self, obj: HomeworkSubmission) -> str:
        u = obj.student
        return f"{u.first_name} {u.last_name}".strip() or u.username

    def get_photo(self, obj: HomeworkSubmission) -> str:
        if not obj.photo:
            return ""
        request = self.context.get("request")
        url = obj.photo.url
        if request is not None:
            return request.build_absolute_uri(url)
        return url
