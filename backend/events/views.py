from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny

from .models import Event
from .serializers import EventDetailSerializer, EventListSerializer


class EventViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return Event.objects.filter(is_published=True).order_by("-starts_at", "-created_at")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return EventDetailSerializer
        return EventListSerializer

