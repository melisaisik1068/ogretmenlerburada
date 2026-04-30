from django.urls import path

from .views import CheckoutView, ManageSubscriptionView, MySubscriptionView, PlanListView, StripeWebhookView

urlpatterns = [
    path("plans/", PlanListView.as_view(), name="plans"),
    path("me/", MySubscriptionView.as_view(), name="my-subscription"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("manage/", ManageSubscriptionView.as_view(), name="manage"),
    path("webhook/stripe/", StripeWebhookView.as_view(), name="stripe-webhook"),
]

