from rest_framework import serializers
from ..models import Edt,Matiere,Parcours,Salle,Classe

class EdtSerializer(serializers.ModelSerializer):
    numMatiere = serializers.PrimaryKeyRelatedField(queryset=Matiere.objects.all())
    numParcours = serializers.PrimaryKeyRelatedField(queryset=Parcours.objects.all())
    numSalle = serializers.PrimaryKeyRelatedField(queryset=Salle.objects.all())
    numClasse = serializers.PrimaryKeyRelatedField(queryset=Classe.objects.all())
    class Meta:
        model=Edt
        fields=["numEdt","numMatiere","numParcours","numSalle","numClasse",
                    "date","heureDebut","heureFin"] 
    def validate(self, data):
        if data['heureDebut'] >= data['heureFin']:
            raise serializers.ValidationError({"heure":"L'heure de début doit être inférieure à l'heure de fin !"})
        return data
    
    def create(self, validated_data):
        return Edt.objects.create(**validated_data)