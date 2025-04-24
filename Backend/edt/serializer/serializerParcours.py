from rest_framework import serializers
from ..models import Parcours,Mention
from django.core.exceptions import ValidationError

class ParcoursSerializer(serializers.ModelSerializer):
    class Meta:
        model=Parcours
        fields=["numParcours","numMention","nomParcours"]
    def validate_numMention(self, value):
        if not value:
            raise serializers.ValidationError({"mention":"Ce champ est obligatoire !"})
        if not Mention.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"mention":"Cet mention n'existe pas !"})
        return value
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Parcours.objects.create(**validated_data)
    