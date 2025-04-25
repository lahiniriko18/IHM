from rest_framework import serializers
from ..models import Constituer,Parcours,Classe
from django.core.exceptions import ValidationError

class ConstituerSerializer(serializers.ModelSerializer):
    numParcours = serializers.PrimaryKeyRelatedField(queryset=Parcours.objects.all())
    numClasse = serializers.PrimaryKeyRelatedField(queryset=Classe.objects.all())
    class Meta:
        model=Constituer
        fields=["numConstituer","numParcours","numClasse"]
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Constituer.objects.create(**validated_data)