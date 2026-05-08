from rest_framework import serializers

from .models import ContactMessage, NewsletterSubscriber


class ContactMessageSerializer(serializers.ModelSerializer):
    turnstile_token = serializers.CharField(write_only=True, required=False, allow_blank=True)
    kvkk_consent = serializers.BooleanField(write_only=True, required=True)

    class Meta:
        model = ContactMessage
        fields = ["name", "email", "phone", "message", "kvkk_consent", "turnstile_token"]

    def validate_kvkk_consent(self, value: bool):
        if value is not True:
            raise serializers.ValidationError("Devam etmek için KVKK onayı gereklidir.")
        return value


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    turnstile_token = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = NewsletterSubscriber
        fields = ["email", "turnstile_token"]
