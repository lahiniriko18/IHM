from rest_framework import serializers
from ..models import Avoir,Edt,Etablissement
from django.core.exceptions import ValidationError

class AvoirSerializer(serializers.ModelSerializer):
    numEtablissement = serializers.PrimaryKeyRelatedField(
        queryset=Etablissement.objects.all(),
        error_messages={
            'does_not_exist': "L'établissement spécifié n'existe pas !",
            'incorrect_type': "Le format de l'ID de l'établissement est invalide !",
        }
    )
    numEdt = serializers.PrimaryKeyRelatedField(
        queryset=Edt.objects.all(),
        error_messages={
            'does_not_exist': "L'emploi du temps spécifié n'existe pas !",
            'incorrect_type': "Le format de l'ID de l'emploi du temps est invalide !",
        }
    )
    class Meta:
        model=Avoir
        fields=["numAvoir","numEdt","numEtablissement"]

    def validate(self, data):
        return data
    
    def create(self, validated_data):
        return Avoir.objects.create(**validated_data)