from rest_framework import serializers

from ..models import Matiere


class MatiereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matiere
        fields = ["numMatiere", "nomMatiere", "codeMatiere"]

    def validate(self, data):
        return data

    def create(self, validated_data):
        return Matiere.objects.create(**validated_data)
