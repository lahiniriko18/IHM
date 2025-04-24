from rest_framework import serializers
from ..models import Etablissement
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import re

class EtablissementSerializer(serializers.ModelSerializer):
    class Meta:
        model=Etablissement
        fields=["numEtablissement","nomEtablissement","adresse","email",
                "slogant","logo","contact","contact"]
        
    def validaterContact(self,contact):
        contactFiltrer=contact.replace(" ","")
        pattern=r'^(?:\+261|0)(20|32|33|34|37|38)\d{7}$'
        if not re.match(pattern, contactFiltrer):
            raise serializers.ValidationError({"erreur":"Contact invalide !"})
        if re.match(r'^\+261',contactFiltrer):
            return f"+261 {contactFiltrer[4:6]} {contactFiltrer[6:8]} {contactFiltrer[8:11]} {contactFiltrer[11:13]}"
        return f"{contactFiltrer[0:3]} {contactFiltrer[3:5]} {contactFiltrer[5:8]} {contactFiltrer[8:10]}"
    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError({"email":"Email invalide !"})
        if Etablissement.objects.filter(email=value).values():
            raise serializers.ValidationError({"email":"Cette email existe déjà !"})
        return value
    def validate(self, data):
        self.validaterContact(data['contact'])
        return data
    
    def create(self, validated_data):
        return Etablissement.objects.create(**validated_data)