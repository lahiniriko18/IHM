from rest_framework import serializers
from ..models import Mention,Etablissement
from django.core.exceptions import ValidationError

class MentionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Mention
        fields=["numMention","numEtablissement","nomMention"]
    def validate_numEtablissement(self, value):
        if not value:
            raise serializers.ValidationError({"etablissement":"Ce champ est obligatoire !"})
        if not Etablissement.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"etablissement":"Cette établissement n'existe pas !"})
        return value
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Mention.objects.create(**validated_data)