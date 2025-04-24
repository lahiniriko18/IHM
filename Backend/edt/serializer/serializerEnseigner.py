from rest_framework import serializers
from ..models import Enseigner,Professeur,Matiere
from django.core.exceptions import ValidationError

class EnseignerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Enseigner
        fields=["numEnseigner","numProfesseur","numMatiere"]
    def validate_numProfesseur(self, value):
        if not value:
            raise serializers.ValidationError({"professeur":"Ce champ est obligatoire !"})
        if not Professeur.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"professeur":"Cet professeur n'existe pas !"})
        return value
    def validate_numMatiere(self, value):
        if not value:
            raise serializers.ValidationError({"matiere":"Ce champ est obligatoire !"})
        if not Matiere.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"matiere":"Cette matière n'existe pas !"})
        return value
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Enseigner.objects.create(**validated_data)