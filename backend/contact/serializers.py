from rest_framework import serializers

from .models import ContactMessage, NewsletterSubscriber


class ContactMessageSerializer(serializers.ModelSerializer):
    turnstile_token = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = ContactMessage
        fields = ["name", "email", "message", "turnstile_token"]


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    turnstile_token = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = NewsletterSubscriber
        fields = ["email", "turnstile_token"]
