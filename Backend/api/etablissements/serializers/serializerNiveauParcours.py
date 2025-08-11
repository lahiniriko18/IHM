from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from ..models import NiveauParcours, Parcours


class NiveauParcoursSerializer(serializers.ModelSerializer):
    numParcours = serializers.PrimaryKeyRelatedField(
        queryset=Parcours.objects.all(),
        error_messages={
            "does_not_exist": "La matière spécifié n'existe pas !",
            "incorrect_type": "Le format de l'ID de la matière est invalide !",
        },
    )

    class Meta:
        model = NiveauParcours
        fields = ["numNiveauParcours", "niveau", "numParcours"]
        validators = [
            UniqueTogetherValidator(
                queryset=NiveauParcours.objects.all(),
                fields=["niveau", "numParcours"],
                message="Ce niveau est déjà associé à ce parcours !",
            )
        ]

    def validate(self, data):
        return data

    def create(self, validated_data):
        if isinstance(validated_data, list):
            donnees = [NiveauParcours(**valeur) for valeur in validated_data]
            return NiveauParcours.objects.bulk_create(donnees)

        return NiveauParcours.objects.create(**validated_data)
