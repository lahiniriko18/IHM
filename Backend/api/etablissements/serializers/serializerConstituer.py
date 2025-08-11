from rest_framework import serializers
from ..models import Constituer, Parcours, Classe


class ConstituerSerializer(serializers.ModelSerializer):
    numParcours = serializers.PrimaryKeyRelatedField(
        queryset=Parcours.objects.all(),
        error_messages={
            "does_not_exist": "Le parcours spécifié n'existe pas !",
            "incorrect_type": "Le format de l'ID de le parcours est invalide !",
        },
    )
    numClasse = serializers.PrimaryKeyRelatedField(
        queryset=Classe.objects.all(),
        error_messages={
            "does_not_exist": "La classe spécifié n'existe pas !",
            "incorrect_type": "Le format de l'ID de la classe est invalide !",
        },
    )

    class Meta:
        model = Constituer
        fields = ["numConstituer", "numParcours", "numClasse"]

    def validate(self, data):
        return data

    def create(self, validated_data):
        if isinstance(validated_data, list):
            donnees = [Constituer(**valeur) for valeur in validated_data]
            return Constituer.objects.bulk_create(donnees)

        return Constituer.objects.create(**validated_data)
