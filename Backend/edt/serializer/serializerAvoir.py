from rest_framework import serializers
from ..models import Avoir,Edt,Etablissement
from django.core.exceptions import ValidationError

class AvoirSerializer(serializers.ModelSerializer):
    numEtablissement = serializers.PrimaryKeyRelatedField(queryset=Etablissement.objects.all())
    numEdt = serializers.PrimaryKeyRelatedField(queryset=Edt.objects.all())
    class Meta:
        model=Avoir
        fields=["numAvoir","numEdt","numEtablissement"]

    def validate(self, data):
        return data
    
    def create(self, validated_data):
        return Avoir.objects.create(**validated_data)