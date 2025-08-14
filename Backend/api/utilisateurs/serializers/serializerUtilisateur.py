from django.contrib.auth import get_user_model
from django.core.validators import validate_email
from rest_framework import serializers

from ...etablissements.serializers.serializerEtablissement import (
    EtablissementSerializer,
)

Utilisateur = get_user_model()
import re


class UtilisateurSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    etablissement = EtablissementSerializer(source="numEtablissement", read_only=True)

    class Meta:
        model = Utilisateur
        fields = [
            "id",
            "numEtablissement",
            "username",
            "email",
            "password",
            "contact",
            "adresse",
            "image",
            "first_name",
            "last_name",
        ]

    def validate_contact(self, value):
        contactFiltrer = value.replace(" ", "")
        pattern = r"^(?:\+261|0)(20|32|33|34|37|38)\d{7}$"
        if not re.match(pattern, contactFiltrer):
            raise serializers.ValidationError({"erreur": "Contact invalide !"})
        if re.match(r"^\+261", contactFiltrer):
            return f"+261 {contactFiltrer[4:6]} {contactFiltrer[6:8]} {contactFiltrer[8:11]} {contactFiltrer[11:13]}"
        return f"{contactFiltrer[0:3]} {contactFiltrer[3:5]} {contactFiltrer[5:8]} {contactFiltrer[8:10]}"

    def validate(self, data):
        return data


class InscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        validate_email(value)
        return value

    def validate(self, attrs):
        return super().validate(attrs)

    def create(self, validated_data):
        user = Utilisateur(
            username=validated_data["username"], email=validated_data["email"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class ModifierUtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = [
            "first_name",
            "last_name",
            "contact",
            "adresse",
            "image",
        ]

    def validate_contact(self, value):
        contactFiltrer = value.replace(" ", "")
        pattern = r"^(?:\+261|0)(20|32|33|34|37|38)\d{7}$"
        if not re.match(pattern, contactFiltrer):
            raise serializers.ValidationError({"erreur": "Contact invalide !"})
        if re.match(r"^\+261", contactFiltrer):
            return f"+261 {contactFiltrer[4:6]} {contactFiltrer[6:8]} {contactFiltrer[8:11]} {contactFiltrer[11:13]}"
        return f"{contactFiltrer[0:3]} {contactFiltrer[3:5]} {contactFiltrer[5:8]} {contactFiltrer[8:10]}"

    def validate(self, data):
        return data
