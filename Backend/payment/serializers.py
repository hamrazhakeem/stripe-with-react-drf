# serializers.py
from rest_framework import serializers

class CreateCheckoutSessionSerializer(serializers.Serializer):
    credits = serializers.IntegerField()
    price_per_credit = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField(max_length=3)