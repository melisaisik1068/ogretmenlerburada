from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .iyzico_payment import MaterialCheckoutIyzicoView, MaterialIyzicoCallbackView
from .views import MaterialCheckoutView, MaterialViewSet, MyOrdersView, StripeShopWebhookView

router = DefaultRouter()
router.register("materials", MaterialViewSet, basename="materials")

urlpatterns = [
    path("checkout/", MaterialCheckoutView.as_view(), name="material-checkout"),
    path("checkout-iyzico/", MaterialCheckoutIyzicoView.as_view(), name="material-checkout-iyzico"),
    path("iyzico/callback/", MaterialIyzicoCallbackView.as_view(), name="material-iyzico-callback"),
    path("webhook/stripe/", StripeShopWebhookView.as_view(), name="stripe-shop-webhook"),
    path("orders/me/", MyOrdersView.as_view(), name="my-orders"),
    path("", include(router.urls)),
]

