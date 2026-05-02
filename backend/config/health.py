"""Yük dengeleyici / Railway health check — DB gerektirmez."""

from django.http import JsonResponse


def health(_request):
    return JsonResponse({"status": "ok"})


def api_root(_request):
    """Kök URL için kısa rehber (API-only Railway); arayüz Vercel'dedir."""

    return JsonResponse(
        {
            "service": "ogretmenlerburada-api",
            "message": "Ana site ön yüzü Vercel üzerindedir; burası yalnızca REST API.",
            "urls": {
                "health": "/api/health/",
                "swagger": "/api/docs/",
                "admin": "/admin/",
                "openapi_schema": "/api/schema/",
            },
        },
    )
