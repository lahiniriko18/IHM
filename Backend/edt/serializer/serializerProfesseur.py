from rest_framework import serializers
from ..models import Professeur,Etablissement
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from datetime import datetime
import re

class ProfesseurSerializer(serializers.ModelSerializer):
    numEtablissement = serializers.PrimaryKeyRelatedField(
        queryset=Etablissement.objects.all(),
        error_messages={
            'does_not_exist': "L'établissement spécifié n'existe pas !",
            'incorrect_type': "Le format de l'ID de l'établissement est invalide !",
        }
    )
    class Meta:
        model=Professeur
        fields=["numProfesseur","numEtablissement","nomProfesseur","prenomProfesseur","nomCourant","grade",
                    "sexe","adresse","contact","email","photos"]
    
    def validate_sexe(self, value):
        if value.lower() not in ["masculin","féminin"]:
            raise serializers.ValidationError({"sexe":"Le sexe est invalide"})
        return value.capitalize()
    def validate_contact(self,contact):
        contactFiltrer=contact.replace(" ","")
        pattern=r'^(?:\+261|0)(20|32|33|34|37|38)\d{7}$'
        if not re.match(pattern, contactFiltrer):
            raise serializers.ValidationError({"erreur":"Contact invalide !"})
        if re.match(r'^\+261',contactFiltrer):
            return f"+261 {contactFiltrer[4:6]} {contactFiltrer[6:8]} {contactFiltrer[8:11]} {contactFiltrer[11:13]}"
        return f"{contactFiltrer[0:3]} {contactFiltrer[3:5]} {contactFiltrer[5:8]} {contactFiltrer[8:10]}"
    def validate_email(self, value):
        ProfesseurInstance=self.instance

        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError({"email":"Email invalide !"})
        if ProfesseurInstance:
            if ProfesseurInstance.email != value:
                if Professeur.objects.filter(email=value).exists():
                     raise serializers.ValidationError({"email":"Cette email existe déjà !"})
        else:
            if Professeur.objects.filter(email=value).exists():
                raise serializers.ValidationError({"email":"Cette email existe déjà !"}) 
        return value
    def validate(self, data):
        return data
    
    def create(self, validated_data):
        return Professeur.objects.create(**validated_data)
    
class ProfesseurStatSerializer(serializers.Serializer):
    numProfesseur=serializers.IntegerField()
    dateDebut=serializers.CharField()
    dateFin=serializers.CharField()

    def validate(self, data):
        if data['dateDebut'] and data['dateFin']:
            try:
                data['dateDebut']=datetime.strptime(data['dateDebut'], "%d-%m-%Y").date()
                data['dateFin']=datetime.strptime(data['dateFin'], "%d-%m-%Y").date()
            except ValueError:
                raise serializers.ValidationError("Format de date invalide !")
            if data['dateDebut'] >= data['dateFin']:
                raise serializers.ValidationError("Le date de début ne doit pas supérieur que la date de fin !")
            return data
        raise serializers.ValidationError("Format de date invalide !")