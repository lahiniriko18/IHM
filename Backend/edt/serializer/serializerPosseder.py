from rest_framework import serializers
from ..models import Posseder,Classe,Groupe
from django.core.exceptions import ValidationError

class PossederSerializer(serializers.ModelSerializer):
    numClasse = serializers.PrimaryKeyRelatedField(queryset=Classe.objects.all())
    numGroupe = serializers.PrimaryKeyRelatedField(queryset=Groupe.objects.all())
    
    class Meta:
        model=Posseder
        fields=["numPosseder","numClasse","numGroupe"]
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Posseder.objects.create(**validated_data)