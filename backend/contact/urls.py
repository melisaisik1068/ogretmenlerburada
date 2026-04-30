from django.urls import path

from .views import ContactMessageCreateView, NewsletterSubscribeView

urlpatterns = [
    path("messages/", ContactMessageCreateView.as_view(), name="contact-message-create"),
    path("newsletter/subscribe/", NewsletterSubscribeView.as_view(), name="newsletter-subscribe"),
]
