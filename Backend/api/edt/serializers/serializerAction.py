from rest_framework import serializers

from ...utilisateurs.models import Utilisateur
from ..models import Action


class ActionSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=Utilisateur.objects.all(),
        error_messages={
            "does_not_exist": "L'utilisateur spécifié n'existe pas !",
            "incorrect_type": "Le format de l'ID de l'utilisateur est invalide !",
        },
    )

    class Meta:
        model = Action
        fields = ["numAction", "user_id", "type", "text", "table", "statut"]

    def validate_type(self, value):
        if value.lower() not in [
            "insertion",
            "modification",
            "suppression",
            "email",
            "téléchargement",
            "téléversement",
        ]:
            raise serializers.ValidationError({"type": "Type d'action invalide !"})
        return value

    def validate_table(self, value):
        if value.lower() not in [
            "utilisateur",
            "professeur",
            "edt",
            "enseigner",
            "avoir",
            "constituer",
            "salle",
            "parcours",
            "mention",
            "classe",
            "matiere",
            "etablissement",
        ]:
            raise serializers.ValidationError(
                {"table": "Table n'existe dans l'application !"}
            )
        return value

    def validate(self, data):
        return data

    def create(self, validated_data):
        return Action.objects.create(**validated_data)
