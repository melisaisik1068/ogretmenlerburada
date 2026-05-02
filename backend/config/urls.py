"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .health import api_root, health

urlpatterns = [
    path("", api_root, name="api-root"),
    path("api/health/", health),
    path('admin/', admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/accounts/", include("accounts.urls")),
    path("api/subscriptions/", include("subscriptions.urls")),
    path("api/community/", include("community.urls")),
    path("api/booking/", include("booking.urls")),
    path("api/marketplace/", include("marketplace.urls")),
    path("api/lessons/", include("lessons.urls")),
    path("api/contact/", include("contact.urls")),
    path("api/blog/", include("blog.urls")),
    path("api/events/", include("events.urls")),
    path("api/wishlist/", include("wishlist.urls")),
    path("api/progress/", include("progress.urls")),
    path("api/reviews/", include("reviews.urls")),
    path("api/search/", include("search.urls")),
]

if settings.DEBUG and (getattr(settings, "SERVE_MEDIA_PUBLIC", False) is True):
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
