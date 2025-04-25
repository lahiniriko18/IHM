from rest_framework import serializers
from ..models import Mention,Etablissement
from django.core.exceptions import ValidationError

class MentionSerializer(serializers.ModelSerializer):
    numEtablissement = serializers.PrimaryKeyRelatedField(queryset=Etablissement.objects.all())
    class Meta:
        model=Mention
        fields=["numMention","numEtablissement","nomMention"]
    def validate(self, data):
        return data
    def create(self, validated_data):
        return Mention.objects.create(**validated_data)