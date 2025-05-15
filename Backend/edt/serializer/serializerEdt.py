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
            raise serializers.ValidationError({"erreur":"L'heure de début doit être inférieure à l'heure de fin !"})
        
        salle=data.get('numSalle')

        if self.instance:
            if salle.numSalle and salle.numSalle != self.instance.numSalle:
                if salle and not salle.statut:
                    raise serializers.ValidationError({"erreur":f"Le salle {salle.nomSalle} n'est pas libre dans ce horaire !"})
        else:
            if salle and not salle.statut:
                raise serializers.ValidationError({"erreur":f"Le salle {salle.nomSalle} n'est pas libre dans ce horaire !"})
        return data
    
    def create(self, validated_data):
        
        if isinstance(validated_data, list):
            for donnees in validated_data:
                salle=donnees.get('numSalle')
                if salle:
                    salle.statut = False
                salle.save()
                donnees['numSalle']=salle
            instances= [Edt(**valeur) for valeur in validated_data]
            return Edt.objects.bulk_create(instances)
        
        else:
            salle=validated_data.get('numSalle')
            if salle:
                salle.statut = False
            salle.save()
            validated_data['numSalle']=salle
            return Edt.objects.create(**validated_data)
    
    def update(self, instances, validated_data):

        if isinstance(instances,list):
            for instance, donnnees in zip(instances, validated_data):

                salle=donnnees.get('numSalle')
                if salle.numSalle != instance.numSalle:
                    ancienSalle = Salle.objects.filter(pk=instance.numSalle).first()
                    ancienSalle.statut = True
                    ancienSalle.save()
                    salle.statut = False
                    salle.save()

                for cle, val in donnnees.items():
                    setattr(instance, cle, val)
                instance.save()
            return instances
        
        else:
            salle=validated_data.get('numSalle')
            if salle.numSalle != instance.numSalle:
                ancienSalle = Salle.objects.filter(pk=instance.numSalle).first()
                ancienSalle.statut = True
                ancienSalle.save()
                salle.statut = False
                salle.save()
                validated_data['numSalle']=salle

            return super().update(instance, validated_data)


# class TitreSerializer(serializers.ListSerializer):
#     titre=serializers.ListSerializer()

#     def validate(self, data):

#         jours=["lundi","mardi","mercredi","jeudi","vendredi","samedi"]
#         if len(data) != 2:
#             raise serializers.ValidationError("Format de la titre invalide !")
#         for ligne in data:
#             if not isinstance(ligne, dict):
#                 raise serializers.ValidationError("Format de la titre invalide !")
        
#         dates=data[0]
#         if not isinstance(dates, dict):
#             raise serializers.ValidationError("Format de la titre invalide !")
#         if len(dates) != 6:
#             raise serializers.ValidationError("L'emploi du temps doit contenir le date de Lundi au Samedi")
        
#         dateDebut=dates.get("lundi")
        


# class EdtTableSerializer(serializers.ListSerializer):
#     titre=serializers.ListField(child=TitreSerializer())