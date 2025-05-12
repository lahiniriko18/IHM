from rest_framework import serializers
from ..models import Groupe
from django.core.exceptions import ValidationError
from ..models import Classe
import re

class GroupeSerializer(serializers.ModelSerializer):
    numClasse = serializers.PrimaryKeyRelatedField(
        queryset=Classe.objects.all(),
        error_messages={
            'does_not_exist': "La classe spécifié n'existe pas !",
            'incorrect_type': "Le format de l'ID de la classe est invalide !",
        }
    )
    class Meta:
        model=Groupe
        fields=["numGroupe","nomGroupe","numClasse"]
    def validate_nomGroupe(self, value):
        pattern=r'^groupe'
        if not re.match(pattern, value.lower()):
            raise serializers.ValidationError("Groupe invalide !")
        return value
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Groupe.objects.create(**validated_data)