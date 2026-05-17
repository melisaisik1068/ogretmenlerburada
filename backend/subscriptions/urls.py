from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .billing_portal import BillingPortalView
from .iyzico_payment import SubscriptionCheckoutIyzicoView, SubscriptionIyzicoCallbackView
from .package_views import (
    InstitutionPackageListView,
    MyStudentPackageView,
    SubscribeInstitutionPackageView,
    TeacherInstitutionPackageViewSet,
)
from .views import CheckoutView, ManageSubscriptionView, MySubscriptionView, PlanListView, StartTrialView, StripeWebhookView

package_router = DefaultRouter()
package_router.register("teacher/packages", TeacherInstitutionPackageViewSet, basename="teacher-institution-package")

urlpatterns = [
    path("plans/", PlanListView.as_view(), name="plans"),
    path("me/", MySubscriptionView.as_view(), name="my-subscription"),
    path("start-trial/", StartTrialView.as_view(), name="start-trial"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("checkout-iyzico/", SubscriptionCheckoutIyzicoView.as_view(), name="checkout-iyzico"),
    path("iyzico/callback/", SubscriptionIyzicoCallbackView.as_view(), name="iyzico-callback"),
    path("billing-portal/", BillingPortalView.as_view(), name="billing-portal"),
    path("manage/", ManageSubscriptionView.as_view(), name="manage"),
    path("webhook/stripe/", StripeWebhookView.as_view(), name="stripe-webhook"),
    path("institution-packages/", InstitutionPackageListView.as_view(), name="institution-packages"),
    path("institution-packages/me/", MyStudentPackageView.as_view(), name="institution-package-me"),
    path("institution-packages/subscribe/", SubscribeInstitutionPackageView.as_view(), name="institution-package-subscribe"),
    path("", include(package_router.urls)),
]

