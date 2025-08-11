from rest_framework import serializers
from ..models import Mention, Etablissement
from rest_framework.validators import UniqueValidator


class MentionSerializer(serializers.ModelSerializer):
    numEtablissement = serializers.PrimaryKeyRelatedField(
        queryset=Etablissement.objects.all(),
        error_messages={
            "does_not_exist": "L'établissement spécifié n'existe pas !",
            "incorrect_type": "Le format de l'ID de l'établissement est invalide !",
        },
    )
    nomMention = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=Mention.objects.all(),
                message="Ce mention existe déjà. Le mention est unique !",
            )
        ]
    )

    class Meta:
        model = Mention
        fields = ["numMention", "numEtablissement", "nomMention", "codeMention"]

    def validate(self, data):
        return data

    def create(self, validated_data):
        return Mention.objects.create(**validated_data)
