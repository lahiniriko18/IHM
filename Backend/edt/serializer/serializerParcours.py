from rest_framework import serializers
from ..models import Parcours,Mention
from django.core.exceptions import ValidationError

class ParcoursSerializer(serializers.ModelSerializer):
    numMention = serializers.PrimaryKeyRelatedField(queryset=Mention.objects.all())
    class Meta:
        model=Parcours
        fields=["numParcours","numMention","nomParcours"]
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Parcours.objects.create(**validated_data)
    