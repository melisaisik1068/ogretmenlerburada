from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.exceptions import ValidationError

from .models import NewsletterSubscriber
from .serializers import ContactMessageSerializer, NewsletterSubscriberSerializer
from .turnstile import is_turnstile_enabled, verify_turnstile


class ContactMessageCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ContactMessageSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"

    def perform_create(self, serializer):
        token = (self.request.data.get("turnstile_token") or "").strip()
        if is_turnstile_enabled() and not verify_turnstile(token, remoteip=self.request.META.get("REMOTE_ADDR")):
            raise ValidationError({"detail": "Captcha doğrulaması başarısız."})
        serializer.save()


class NewsletterSubscribeView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = NewsletterSubscriberSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "newsletter_subscribe"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = (request.data.get("turnstile_token") or "").strip()
        if is_turnstile_enabled() and not verify_turnstile(token, remoteip=request.META.get("REMOTE_ADDR")):
            raise ValidationError({"detail": "Captcha doğrulaması başarısız."})
        email = serializer.validated_data["email"].strip().lower()
        _, created = NewsletterSubscriber.objects.get_or_create(email=email)
        return Response({"ok": True, "created": created}, status=201 if created else 200)
