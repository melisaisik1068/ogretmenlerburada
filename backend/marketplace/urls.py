from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MaterialCheckoutView, MaterialViewSet, MyOrdersView, StripeShopWebhookView

router = DefaultRouter()
router.register("materials", MaterialViewSet, basename="materials")

urlpatterns = [
    path("checkout/", MaterialCheckoutView.as_view(), name="material-checkout"),
    path("webhook/stripe/", StripeShopWebhookView.as_view(), name="stripe-shop-webhook"),
    path("orders/me/", MyOrdersView.as_view(), name="my-orders"),
    path("", include(router.urls)),
]

