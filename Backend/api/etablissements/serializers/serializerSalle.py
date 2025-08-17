from datetime import datetime, timedelta, date

from rest_framework import serializers

from ..models import Salle


class SalleSerializer(serializers.ModelSerializer):
    heureTotal = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Salle
        fields = ["numSalle", "nomSalle", "lieuSalle", "statut", "heureTotal"]

    def validate(self, data):
        return data

    def create(self, validated_data):
        return Salle.objects.create(**validated_data)

    def get_heureTotal(self, obj):
        edts = obj.edts.all()
        heureTotal = timedelta()
        for edt in edts:
            debut = datetime.combine(datetime.today(), edt.heureDebut)
            fin = datetime.combine(datetime.today(), edt.heureFin)
            heureTotal += fin - debut
        return heureTotal.total_seconds()

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        dateActuel = date.today()
        heureActuel = datetime.now().time()
        edt_existe = instance.edts.filter(
            date=dateActuel,
            heureDebut__lte=heureActuel,
            heureFin__gte=heureActuel,
        ).exists()

        if edt_existe != instance.statut:
            instance.statut = not edt_existe
            instance.save(update_fields=["statut"])
            representation["statut"] = instance.statut
        return representation


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
