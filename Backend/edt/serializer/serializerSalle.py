from rest_framework import serializers
from ..models import Salle
from django.core.exceptions import ValidationError

class SalleSerializer(serializers.ModelSerializer):
    class Meta:
        model=Salle
        fields=["numSalle","nomSalle","lieuSalle","statut"]
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Salle.objects.create(**validated_data)