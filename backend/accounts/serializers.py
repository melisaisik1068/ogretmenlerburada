from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import TeacherVerificationDocument, TeacherVerificationStatus, UserRole

User = get_user_model()


class UserPublicSerializer(serializers.ModelSerializer):
    is_teacher_verified = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "role",
            "bio",
            "avatar_url",
            "teacher_verification_status",
            "is_teacher_verified",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=UserRole.choices)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "role"]

    def create(self, validated_data):
        role = validated_data.get("role")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            role=role,
            teacher_verification_status=TeacherVerificationStatus.PENDING
            if role == UserRole.TEACHER
            else TeacherVerificationStatus.NOT_REQUIRED,
        )
        return user


class TeacherVerificationDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherVerificationDocument
        fields = ["id", "file", "original_filename", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        request = self.context["request"]
        upload = validated_data["file"]
        return TeacherVerificationDocument.objects.create(
            teacher=request.user,
            file=upload,
            original_filename=getattr(upload, "name", "") or "",
        )

