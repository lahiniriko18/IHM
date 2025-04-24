from rest_framework import serializers
from ..models import Constituer,Parcours,Classe
from django.core.exceptions import ValidationError

class ConstituerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Constituer
        fields=["numConstituer","numParcours","numClasse"]
    def validate_numParcours(self, value):
        if not value:
            raise serializers.ValidationError({"parcours":"Ce champ est obligatoire !"})
        if not Parcours.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"parcours":"Cette parcours n'existe pas !"})
        return value
    def validate_numClasse(self, value):
        if not value:
            raise serializers.ValidationError({"classe":"Ce champ est obligatoire !"})
        if not Classe.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"classe":"Cette classe n'existe pas !"})
        return value
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Constituer.objects.create(**validated_data)