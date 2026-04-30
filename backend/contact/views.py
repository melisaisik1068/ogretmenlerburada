from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import NewsletterSubscriber
from .serializers import ContactMessageSerializer, NewsletterSubscriberSerializer


class ContactMessageCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ContactMessageSerializer


class NewsletterSubscribeView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = NewsletterSubscriberSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()
        _, created = NewsletterSubscriber.objects.get_or_create(email=email)
        return Response({"ok": True, "created": created}, status=201 if created else 200)
