from rest_framework import serializers
from ..models import Posseder,Classe,Groupe
from django.core.exceptions import ValidationError

class PossederSerializer(serializers.ModelSerializer):
    numClasse = serializers.PrimaryKeyRelatedField(
        queryset=Classe.objects.all(),
        error_messages={
            'does_not_exist': "La classe spécifié n'existe pas !",
            'incorrect_type': "Le format de l'ID de la classe est invalide !",
        }
    )
    numGroupe = serializers.PrimaryKeyRelatedField(
        queryset=Groupe.objects.all(),
        error_messages={
            'does_not_exist': "Le groupe spécifié n'existe pas !",
            'incorrect_type': "Le format de l'ID de le groupe est invalide !",
        }
    )
    
    class Meta:
        model=Posseder
        fields=["numPosseder","numClasse","numGroupe"]
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Posseder.objects.create(**validated_data)