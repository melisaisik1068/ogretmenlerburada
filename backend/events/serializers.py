from rest_framework import serializers

from .models import Event


class EventListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "slug", "title", "location", "starts_at", "ends_at", "cover_image_url"]


class EventDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "slug", "title", "description", "location", "starts_at", "ends_at", "cover_image_url"]

