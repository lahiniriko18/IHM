from rest_framework import serializers

from ...etablissements.models import NiveauParcours, Posseder
from ..models import Matiere


class PossederSerializer(serializers.ModelSerializer):
    numNiveauParcours = serializers.PrimaryKeyRelatedField(
        queryset=NiveauParcours.objects.all(),
        error_messages={
            "does_not_exist": "Le niveau avec parcours spécifié n'existe pas !",
            "incorrect_type": "Le format de l'ID du niveau avec parcours est invalide !",
        },
    )
    numMatiere = serializers.PrimaryKeyRelatedField(
        queryset=Matiere.objects.all(),
        error_messages={
            "does_not_exist": "La matière spécifié n'existe pas !",
            "incorrect_type": "Le format de l'ID de la matière est invalide !",
        },
    )

    class Meta:
        model = Posseder
        fields = ["numPosseder", "numNiveauParcours", "numMatiere"]

    def validate(self, data):
        return data

    def create(self, validated_data):

        if isinstance(validated_data, list):
            donnees = [Posseder(**valeur) for valeur in validated_data]
            return Posseder.objects.bulk_create(donnees)

        return Posseder.objects.create(**validated_data)
