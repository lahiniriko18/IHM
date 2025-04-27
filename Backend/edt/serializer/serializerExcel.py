from rest_framework import serializers

class ExcelSerializer(serializers.Serializer):
    fichier=serializers.FileField()