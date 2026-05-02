from django.urls import path

from .billing_portal import BillingPortalView
from .iyzico_payment import SubscriptionCheckoutIyzicoView, SubscriptionIyzicoCallbackView
from .views import CheckoutView, ManageSubscriptionView, MySubscriptionView, PlanListView, StripeWebhookView

urlpatterns = [
    path("plans/", PlanListView.as_view(), name="plans"),
    path("me/", MySubscriptionView.as_view(), name="my-subscription"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("checkout-iyzico/", SubscriptionCheckoutIyzicoView.as_view(), name="checkout-iyzico"),
    path("iyzico/callback/", SubscriptionIyzicoCallbackView.as_view(), name="iyzico-callback"),
    path("billing-portal/", BillingPortalView.as_view(), name="billing-portal"),
    path("manage/", ManageSubscriptionView.as_view(), name="manage"),
    path("webhook/stripe/", StripeWebhookView.as_view(), name="stripe-webhook"),
]

