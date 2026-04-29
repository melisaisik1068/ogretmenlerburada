from django.contrib.auth import get_user_model
from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .permissions import IsTeacher
from .serializers import RegisterSerializer, TeacherVerificationDocumentSerializer, UserPublicSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class MeView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserPublicSerializer

    def get_object(self):
        return self.request.user


class TeacherVerificationDocumentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsTeacher]
    serializer_class = TeacherVerificationDocumentSerializer

    def get_queryset(self):
        return self.request.user.verification_documents.all()

    @action(detail=False, methods=["get"])
    def status(self, request):
        u = request.user
        return Response(
            {
                "teacher_verification_status": getattr(u, "teacher_verification_status", None),
                "is_teacher_verified": getattr(u, "is_teacher_verified", False),
            }
        )

from django.shortcuts import render

# Create your views here.
