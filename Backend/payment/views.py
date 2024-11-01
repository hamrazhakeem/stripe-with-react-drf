import stripe
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from .models import Transaction
from .serializers import CreateCheckoutSessionSerializer
import os
from dotenv import load_dotenv
load_dotenv()  

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

class CreateCheckoutSession(APIView):
    def post(self, request):
        serializer = CreateCheckoutSessionSerializer(data=request.data)
        if serializer.is_valid():
            credits = serializer.validated_data['credits']
            price_per_credit = serializer.validated_data['price_per_credit']
            currency = serializer.validated_data['currency']
    
            try:
                # Create Stripe checkout session
                unit_amount = int(price_per_credit * 100) 
                session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[{
                        'price_data': {
                            'currency': currency,
                            'product_data': {
                                'name': 'Credits',
                                'description': f'{credits} credits',
                            },
                            'unit_amount': int(price_per_credit * 100),  # Amount in paise
                        },
                        'quantity': credits,
                    }],
                    mode='payment',
                    success_url = f"{os.getenv('FRONTEND_DOMAIN')}/payment/success?session_id={{CHECKOUT_SESSION_ID}}&amount={price_per_credit * credits}&credits={credits}",
                    cancel_url=f"{os.getenv('FRONTEND_DOMAIN')}/payment/cancel",
                    metadata={
                        'credits': credits,
                    }
                )

                return Response({
                    'session_id': session.id,
                    'amount': unit_amount,
                    'quantity': credits}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StripeWebhook(APIView):
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
            )
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            handle_checkout_completed(session)

        return Response(status=status.HTTP_200_OK)

@transaction.atomic
def handle_checkout_completed(session):
    try:
        credits = int(session['metadata']['credits'])

        # Create transaction record without user association
        Transaction.objects.create(
            credits=credits,
            amount=session['amount_total'] / 100,  # Convert from paise to rupees
            payment_id=session['payment_intent'],
            status='completed'
        )
    except Exception as e:
        print(f"Error processing payment: {str(e)}")
        raise

