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
            "phone",
            "teacher_verification_status",
            "is_teacher_verified",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=UserRole.choices)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["username", "email", "phone", "password", "first_name", "last_name", "role"]

    def validate(self, attrs):
        email = (attrs.get("email") or "").strip()
        phone = (attrs.get("phone") or "").strip()

        if email and User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "Bu e‑posta ile zaten kayıt var."})
        if phone and User.objects.filter(phone=phone).exists():
            raise serializers.ValidationError({"phone": "Bu telefon ile zaten kayıt var."})
        return attrs

    def create(self, validated_data):
        role = validated_data.get("role")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            phone=(validated_data.get("phone") or "").strip(),
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

