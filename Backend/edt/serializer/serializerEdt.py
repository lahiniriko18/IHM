from rest_framework import serializers
from ..models import Edt,Matiere,Parcours,Salle,Classe

class EdtSerializer(serializers.ModelSerializer):
    class Meta:
        model=Edt
        fields=["numEdt","numMatiere","numParcours","numSalle","numClasse",
                    "date","heureDebut","heureFin"] 
    def validate_numMatiere(self, value):
        if not value:
            raise serializers.ValidationError({"matiere":"Ce champ est obligatoire !"})
        if not Matiere.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"matiere":"Cette matière n'existe pas !"})
        return value
    def validate_numParcours(self, value):
        if value and not Parcours.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"parcours":"Cette parcours n'existe pas !"})
        return value
    def validate_numSalle(self, value):
        if value and not Salle.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"salle":"Cette salle n'existe pas !"})
        return value
    def validate_numClasse(self, value):
        if value and not Classe.objects.filter(pk=value).exists():
            raise serializers.ValidationError({"classe":"Cette classe n'existe pas !"})
        return value
    def validate(self, data):
        if data['heureDebut'] >= data['heureFin']:
            raise serializers.ValidationError({"heure":"L'heure de début doit être inférieure à l'heure de fin !"})
        return data
    
    def create(self, validated_data):
        return Edt.objects.create(**validated_data)