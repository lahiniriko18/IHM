from rest_framework import serializers
from ..models import Avoir,Edt,Etablissement
from django.core.exceptions import ValidationError

class AvoirSerializer(serializers.ModelSerializer):
    class Meta:
        model=Avoir
        fields=["numAvoir","numEdt","numEtablissement"]

    def validate_numEdt(self, value):
        if not value:
            raise serializers.ValidationError({"edt":"Ce champ est obligatoire !"})
        if not Edt.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"edt":"Cette emploi du temps n'existe pas !"})
        return value
    def validate_numEtablissement(self, value):
        if not value:
            raise serializers.ValidationError({"etablissement":"Ce champ est obligatoire !"})
        if not Etablissement.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"etablissement":"Cette etablissement n'existe pas !"})
        return value
    def validate(self, data):
        return data
    
    def create(self, validated_data):
        return Avoir.objects.create(**validated_data)