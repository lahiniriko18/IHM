from rest_framework import serializers
from ..models import Enseigner,Professeur,Matiere
from django.core.exceptions import ValidationError

class EnseignerSerializer(serializers.ModelSerializer):
    numProfesseur = serializers.PrimaryKeyRelatedField(queryset=Professeur.objects.all())
    numMatiere = serializers.PrimaryKeyRelatedField(queryset=Matiere.objects.all())
    class Meta:
        model=Enseigner
        fields=["numEnseigner","numProfesseur","numMatiere"]
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Enseigner.objects.create(**validated_data)