from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate
from ..models import Utilisateur

class ConnexionSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        try:
            user = Utilisateur.objects.get(username=attrs.get("username"))
        except Utilisateur.DoesNotExist:
            raise serializers.ValidationError("Nom d'utilisateur invalide")
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'contact': user.contact,
            'adresse': user.adresse,
        }
        return data
