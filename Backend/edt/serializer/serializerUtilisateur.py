from rest_framework import serializers
from django.contrib.auth import authenticate
from ..models import Utilisateur
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import re
from datetime  import date

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model=Utilisateur
        fields=['id', 'username', 'email', 'password', 'contact', 'datenaiss', 'description', 'image']


class InscriptionSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model=Utilisateur
        fields=['id', 'username', 'email', 'password', 'confirm_password',
                 'first_name', 'last_name',  'contact', 'datenaiss', 'description', 'image']

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError({"username":"Le nom d'utilisateur doit contenir au moins 3 caractères."})
        return value
    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError({"email":"Email invalide"})
        if Utilisateur.objects.filter(email=value).exists():
            raise serializers.ValidationError({"email":"Cette email existe déjà"})
        return value
    def validate_datenaiss(self, value):
        if value >= date.today():
            raise serializers.ValidationError({"datenaiss":"La date de naissance doit être antérieur à aujourd'hui."})
        return value
    def validate_complexe_password(self, password):
        if len(password) <  8:
            raise serializers.ValidationError({"password":"Le mot de passe doit contenir au moins 8 caractères."})
        if not re.search(r'[A-Z]', password):
            raise serializers.ValidationError({"password":"Le mot de passe doit contenir une majuscule."})
        if not re.search(r'[a-z]', password):
            raise serializers.ValidationError({"password":"Le mot de passe doit contenir une minuscule."})
        if not re.search(r'\d', password):
            raise serializers.ValidationError({"password":"Le mot de passe doit contenir un chiffre."})
        if not re.search(r'[\W_]', password):
            raise serializers.ValidationError({"password":"Le mot de passe doit contenir un caractère spécial."})
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password":f"Les mots de passe ne correspondent pas."})
        self.validate_complexe_password(data['password'])

        return data
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password=validated_data.pop('password')
        user = Utilisateur(**validated_data)
        user.set_password(password)
        user.save()
        return user
        
class ConnexionSerializer(serializers.ModelSerializer):
    username=serializers.CharField()
    password=serializers.CharField(write_only=True)

    class Meta:
        model=Utilisateur
        fields=['username', 'password']