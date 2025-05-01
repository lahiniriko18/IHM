from rest_framework import serializers
from ..models import Edt,Matiere,Parcours,Salle,Classe

class EdtSerializer(serializers.ModelSerializer):
    numMatiere = serializers.PrimaryKeyRelatedField(
        queryset=Matiere.objects.all(),
        error_messages={
            'does_not_exist': "La matière spécifié n'existe pas !",
            'incorrect_type': "Le format de l'ID de la matière est invalide !",
        }
    )
    numParcours = serializers.PrimaryKeyRelatedField(
        queryset=Parcours.objects.all(),
        error_messages={
            'does_not_exist': "Le parcours spécifié n'existe pas !",
            'incorrect_type': "Le format de l'ID de le parcours est invalide !",
        }
    )
    numSalle = serializers.PrimaryKeyRelatedField(
        queryset=Salle.objects.all(),
        error_messages={
            'does_not_exist': "La salle spécifié n'existe pas !",
            'incorrect_type': "Le format de l'ID de la salle est invalide !",
        }
    )
    numClasse = serializers.PrimaryKeyRelatedField(
        queryset=Classe.objects.all(),
        error_messages={
            'does_not_exist': "La classe spécifié n'existe pas !",
            'incorrect_type': "Le format de l'ID de la classe est invalide !",
        }
    )
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