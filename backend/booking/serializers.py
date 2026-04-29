from rest_framework import serializers

from accounts.serializers import UserPublicSerializer

from .models import Appointment, TeacherAvailability


class TeacherAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherAvailability
        fields = ["id", "weekday", "start_time", "end_time", "is_active"]
        read_only_fields = ["id"]


class AppointmentSerializer(serializers.ModelSerializer):
    teacher = UserPublicSerializer(read_only=True)
    student = UserPublicSerializer(read_only=True)
    teacher_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Appointment
        fields = ["id", "teacher", "student", "teacher_id", "starts_at", "ends_at", "status", "note", "created_at"]
        read_only_fields = ["id", "teacher", "student", "status", "created_at"]

