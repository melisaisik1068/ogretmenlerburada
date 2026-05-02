from django.contrib.auth import get_user_model
from django.contrib.auth.forms import SetPasswordForm
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from config.notify import notify_password_reset

User = get_user_model()


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        if not email:
            return Response({"detail": "email gerekli."}, status=400)

        user = User.objects.filter(email__iexact=email).first()

        if user and user.is_active and user.has_usable_password():
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            base = settings.FRONTEND_PUBLIC_URL.rstrip("/")
            link = f"{base}/reset-password?uid={uid}&token={token}"
            notify_password_reset(user.email, reset_link=link)

        # Enum / timing sızıntısını önlemek için hep aynı yanıt
        return Response({"ok": True}, status=200)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = (request.data.get("uid") or "").strip()
        token = (request.data.get("token") or "").strip()
        new_password = request.data.get("new_password")
        if not uid or not token or not new_password:
            return Response({"detail": "uid, token ve new_password gerekli."}, status=400)

        try:
            raw = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=raw)
        except Exception:
            return Response({"detail": "Geçersiz veya süresi dolmuş bağlantı."}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Geçersiz veya süresi dolmuş bağlantı."}, status=400)

        form = SetPasswordForm(user, data={"new_password1": new_password, "new_password2": new_password})
        if not form.is_valid():
            return Response({"detail": form.errors.as_text()}, status=400)
        form.save()
        return Response({"ok": True}, status=200)
