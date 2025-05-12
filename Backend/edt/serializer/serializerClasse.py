from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from ..models import Classe
from django.core.exceptions import ValidationError

class ClasseSerializer(serializers.ModelSerializer):
    niveau = serializers.CharField( 
        validators=[
            UniqueValidator(
                queryset=Classe.objects.all(),
                message="Ce niveau existe déjà. Le niveau est unique !"
            )
        ]
    )
    class Meta:
        model=Classe
        fields=["numClasse","niveau"]
    def validate_niveau(self, value):
        if value.upper() not in ["L1","L2","L3","M1","M2"]:
            raise serializers.ValidationError({"niveau":"Niveau invalide !"})
        return value.upper()
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Classe.objects.create(**validated_data)