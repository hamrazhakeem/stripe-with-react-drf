from django.urls import path
from .views import *

urlpatterns = [
    path('api/create-checkout-session/', CreateCheckoutSession.as_view(), name='create_checkout_session'),
    path('stripe/webhook/', StripeWebhook.as_view(), name='stripe_webhook'),
]