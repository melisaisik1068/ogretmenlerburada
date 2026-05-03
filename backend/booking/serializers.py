from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.serializers import UserPublicSerializer

from .models import Appointment, AppointmentStatus, TeacherAvailability

User = get_user_model()


class TeacherAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherAvailability
        fields = ["id", "weekday", "start_time", "end_time", "is_active"]
        read_only_fields = ["id"]


class AppointmentListSerializer(serializers.ModelSerializer):
    teacher = UserPublicSerializer(read_only=True)
    student = UserPublicSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "teacher",
            "student",
            "starts_at",
            "ends_at",
            "status",
            "note",
            "meeting_url",
            "created_at",
        ]
        read_only_fields = fields


class AppointmentCreateSerializer(serializers.ModelSerializer):
    teacher_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Appointment
        fields = ["teacher_id", "starts_at", "ends_at", "note"]

    def validate_teacher_id(self, value: int):
        try:
            u = User.objects.get(pk=value)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError("Öğretmen bulunamadı.") from exc
        if getattr(u, "role", None) != "teacher":
            raise serializers.ValidationError("Seçilen kullanıcı öğretmen değildir.")
        return value

    def validate(self, attrs):
        if attrs["ends_at"] <= attrs["starts_at"]:
            raise serializers.ValidationError("Bitiş zamanı başlangıçtan sonra olmalıdır.")
        request = self.context.get("request")
        if request and attrs.get("teacher_id") == request.user.id:
            raise serializers.ValidationError({"teacher_id": "Kendinize randevu oluşturamazsınız."})
        return attrs


class AppointmentPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ["note", "meeting_url", "status"]

    def validate(self, attrs):
        inst: Appointment = self.instance  # type: ignore[assignment]
        user = self.context["request"].user
        new_status = attrs.get("status", inst.status)
        new_meeting = attrs.get("meeting_url", inst.meeting_url)

        is_teacher = inst.teacher_id == user.id
        is_student = inst.student_id == user.id

        if not is_teacher and not is_student:
            raise serializers.ValidationError("Bu randevuyu güncelleyemezsiniz.")

        if inst.status in (AppointmentStatus.CANCELED, AppointmentStatus.COMPLETED) and attrs:
            raise serializers.ValidationError("İptal veya tamamlanmış randevu güncellenemez.")

        if is_student:
            if set(attrs) - {"note", "status"}:
                raise serializers.ValidationError("Öğrenci yalnızca not veya iptal güncelleyebilir.")
            if "meeting_url" in attrs and new_meeting != inst.meeting_url:
                raise serializers.ValidationError({"meeting_url": "Öğrenci toplantı linkini değiştiremez."})
            if "status" in attrs:
                if new_status != AppointmentStatus.CANCELED:
                    raise serializers.ValidationError({"status": "Öğrenci yalnızca randevuyu iptal edebilir."})
                if inst.status not in (AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED):
                    raise serializers.ValidationError({"status": "Bu aşamada iptal edilemez."})

        if is_teacher:
            if "status" in attrs:
                if new_status == AppointmentStatus.CONFIRMED:
                    if inst.status != AppointmentStatus.PENDING:
                        raise serializers.ValidationError({"status": "Yalnızca bekleyen randevu onaylanabilir."})
                elif new_status == AppointmentStatus.CANCELED:
                    if inst.status not in (
                        AppointmentStatus.PENDING,
                        AppointmentStatus.CONFIRMED,
                    ):
                        raise serializers.ValidationError({"status": "Bu durumda iptal edilemez."})
                elif new_status == AppointmentStatus.COMPLETED:
                    if inst.status != AppointmentStatus.CONFIRMED:
                        raise serializers.ValidationError({"status": "Yalnızca onaylı randevu tamamlanabilir."})
                elif new_status != inst.status:
                    raise serializers.ValidationError({"status": "Geçersiz durum geçişi."})
            if "meeting_url" in attrs and new_meeting and len(str(new_meeting)) > 500:
                raise serializers.ValidationError({"meeting_url": "Bağlantı çok uzun."})

        return attrs
