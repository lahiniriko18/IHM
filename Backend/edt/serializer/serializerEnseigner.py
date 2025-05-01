from rest_framework import serializers
from ..models import Enseigner,Professeur,Matiere
from django.core.exceptions import ValidationError

class EnseignerSerializer(serializers.ModelSerializer):
    numProfesseur = serializers.PrimaryKeyRelatedField(
        queryset=Professeur.objects.all(),
        error_messages={
            'does_not_exist': "Le professeur spécifié n'existe pas !",
            'incorrect_type': "Le format de l'ID de le professeur est invalide !",
        }
    )
    numMatiere = serializers.PrimaryKeyRelatedField(
        queryset=Matiere.objects.all(),
        error_messages={
            'does_not_exist': "La matière spécifié n'existe pas !",
            'incorrect_type': "Le format de l'ID de la matière est invalide !",
        }
    )
    class Meta:
        model=Enseigner
        fields=["numEnseigner","numProfesseur","numMatiere"]
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Enseigner.objects.create(**validated_data)