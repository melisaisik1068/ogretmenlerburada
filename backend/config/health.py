"""Yük dengeleyici / Railway health check — DB gerektirmez."""

from django.http import JsonResponse


def health(_request):
    return JsonResponse({"status": "ok"})
