from rest_framework import serializers
from ..models import Salle
from datetime import datetime


class SalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salle
        fields = ["numSalle", "nomSalle", "lieuSalle", "statut"]

    def validate(self, data):
        return data

    def create(self, validated_data):
        return Salle.objects.create(**validated_data)


class SalleStatSerializer(serializers.Serializer):
    dateDebut = serializers.CharField()
    dateFin = serializers.CharField()

    def validate(self, data):
        if data["dateDebut"] and data["dateFin"]:
            try:
                data["dateDebut"] = datetime.strptime(
                    data["dateDebut"], "%d-%m-%Y"
                ).date()
                data["dateFin"] = datetime.strptime(data["dateFin"], "%d-%m-%Y").date()
            except ValueError:
                raise serializers.ValidationError("Format de date invalide !")
            if data["dateDebut"] >= data["dateFin"]:
                raise serializers.ValidationError(
                    "Le date de début ne doit pas supérieur que la date de fin !"
                )
            return data
        raise serializers.ValidationError("Format de date invalide !")
