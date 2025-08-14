from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from ..models import Mention, Parcours


class ParcoursSerializer(serializers.ModelSerializer):
    numMention = serializers.PrimaryKeyRelatedField(
        queryset=Mention.objects.all(),
        error_messages={
            "does_not_exist": "Le mention spécifié n'existe pas !",
            "incorrect_type": "Le format de l'ID de le mention est invalide !",
        },
    )
    nomParcours = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=Parcours.objects.all(),
                message="Ce parcours existe déjà. Le parcours est unique !",
            )
        ]
    )

    class Meta:
        model = Parcours
        fields = ["numParcours", "numMention", "nomParcours", "codeParcours"]

    def validate(self, data):
        return data

    def create(self, validated_data):
        return Parcours.objects.create(**validated_data)
