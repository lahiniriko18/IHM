from rest_framework import serializers
from ..models import Groupe
from django.core.exceptions import ValidationError
import re

class GroupeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Groupe
        fields=["numGroupe","nomGroupe"]
    def validate_nomGroupe(self, value):
        pattern=r'^groupe'
        if not re.match(pattern, value.lower()):
            raise serializers.ValidationError({"nomGroupe":"Groupe invalide !"})
        return value
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Groupe.objects.create(**validated_data)