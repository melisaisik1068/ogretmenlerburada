from rest_framework import generics
from rest_framework.permissions import AllowAny

from .serializers import ContactMessageSerializer


class ContactMessageCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ContactMessageSerializer
