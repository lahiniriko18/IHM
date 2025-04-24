from rest_framework import serializers
from ..models import Action,Utilisateur
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import re

class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Action
        fields=["numAction","user_id","type","text","table","statut"] 

    def validate_user_id(self, value):
        if value and not Utilisateur.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"utilisateur":"Cette utilisateur n'existe pas !"})
        return value
    def validate_type(self, value):
        if value.lower() not in ["insertion","modification","suppression","email","téléchargement","téléversement"]:
            raise serializers.ValidationError({"type":"Type d'action invalide !"})
        return value
    def validate_table(self, value):
        if value.lower() not in ["utilisateur","professeur","edt","enseigner","avoir","constituer",
                                 "salle","parcours","mention","classe","matiere","etablissement"]:
            raise serializers.ValidationError({"table":"Table n'existe dans l'application !"})
        return value
    def validate(self, data):
        return data
    
    def create(self, validated_data):
        return Action.objects.create(**validated_data)