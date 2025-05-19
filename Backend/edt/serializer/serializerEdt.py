from rest_framework import serializers
from ..models import Edt,Matiere,Parcours,Salle,Classe,Mention,Professeur,Enseigner,NiveauParcours
from datetime import datetime

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

class JourSerializer(serializers.Serializer):
    lundi=serializers.CharField()
    mardi=serializers.CharField()
    mercredi=serializers.CharField()
    jeudi=serializers.CharField()
    vendredi=serializers.CharField()
    samedi=serializers.CharField()

    def validate(self, data):
        jours=["lundi","mardi","mercredi","jeudi","vendredi","samedi"]
        donees={}
        erreurs=[]
        for jour in jours:
            dateStr=data.get(jour)
            try:
                dateObj=datetime.strptime(dateStr, "%d-%m-%Y").date()
                donees[jour]=dateObj
            except ValueError:
                erreurs.append(f"Format de date {dateStr} invalide !")
        if erreurs:
            raise serializers.ValidationError({"erreur":erreurs})
        return donees
        
class ClasseSerializer(serializers.Serializer):
    numClasse=serializers.IntegerField()
    niveau=serializers.CharField()
    groupe= serializers.CharField()
    
    def validate(self, data):
        classe=Classe.objects.filter(pk=data['numClasse'],niveau=data['niveau'],groupe=data.get('groupe')).exists()
        if not classe:
            raise serializers.ValidationError({"erreur":"Ce classe n'existe pas !"})
        return data


class ParcoursSerializer(serializers.Serializer):
    numParcours = serializers.IntegerField()
    numMention=serializers.PrimaryKeyRelatedField(
        queryset=Mention.objects.all(),
        error_messages={"does_not_exist":"Ce mention n'existe pas !"}
    )
    nomParcours = serializers.CharField()
    codeParcours = serializers.CharField()

    def validate(self, data):
        parcours=Parcours.objects.filter(pk=data['numParcours'], nomParcours=data['nomParcours'], codeParcours=data.get('codeParcours'), numMention=data['numMention'].numMention).first()
        if not parcours:
            raise serializers.ValidationError({"erreur":"Ce parcours n'existe pas !"})
        data['numMention']=data['numMention'].numMention
        return data
    

class ClasseParcoursSerializer(serializers.Serializer):
    classe=ClasseSerializer()
    parcours=ParcoursSerializer()


class HoraireSerializer(serializers.Serializer):
    heureDebut=serializers.TimeField()
    heureFin=serializers.TimeField()

    def validate(self, data):
        if data['heureDebut'] >= data['heureFin']:
            raise serializers.ValidationError({"erreur":"L'heure de début ne doit pas supérieur à heure de fin !"})
        return data

class SeanceSerializer(serializers.Serializer):
    classe=serializers.PrimaryKeyRelatedField(
        queryset=Classe.objects.all(),
        error_messages={"does_not_exist":"Ce classe n'existe pas !"}
    )
    matiere=serializers.PrimaryKeyRelatedField(
        queryset=Matiere.objects.all(),
        error_messages={"does_not_exist":"Ce matière n'existe pas !"}
    )
    professeur=serializers.PrimaryKeyRelatedField(
        queryset=Professeur.objects.all(),
        error_messages={"does_not_exist":"Ce professeur n'existe pas !"}
    )
    salle=serializers.PrimaryKeyRelatedField(
        queryset=Salle.objects.all(),
        error_messages={"does_not_exist":"Ce salle n'existe pas !"}
    )

    def validate(self, data):
        professeur=data.get('professeur')
        matiere=data.get('matiere')
        classe=data.get('classe')
        salle=data.get('salle')

        dateJour=self.context.get("date")
        print(dateJour)
        horaire=self.context.get("horaire")

        enseigner=Enseigner.objects.filter(numProfesseur=professeur.numProfesseur, numMatiere=matiere.numMatiere).exists()

        if not enseigner:
            raise serializers.ValidationError({"erreur":"Ce professeur ne correspond pas par ce matière !"})
        
        if not salle.statut:
            raise serializers.ValidationError({"erreur":"Ce salle n'est pas libre dans ce horaire !"})
        edt=salle.edts.filter(date=datetime.strptime(dateJour, "%d-%m-%Y").date(),heureDebut__lte=horaire["heureDebut"],heureFin__gte=horaire["heureFin"]).exists()
        if edt:
            raise serializers.ValidationError({"erreur":"Ce salle n'est pas libre dans ce date et horaire !"})
        data['salle']=salle.numSalle
        data['professeur']=professeur.numProfesseur
        data['matiere']=matiere.numMatiere
        data['classe']=classe.numClasse
        return data

class ContenuSerializer(serializers.Serializer):
    Horaire=HoraireSerializer()
    Lundi=serializers.ListField()
    Mardi=serializers.ListField()
    Mercredi=serializers.ListField()
    Jeudi=serializers.ListField()
    Vendredi=serializers.ListField()
    Samedi=serializers.ListField()

    def validate(self, data):
        jours=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]
        donnees={
            "Horaire":data['Horaire']
        }
        dates=self.context.get("dates")
        horaire=data['Horaire']
        for jour in jours:

            if not isinstance(data.get(jour), list):
                raise serializers.ValidationError({"erreur":f"Le contenu du jour {jour} doit contenir un tableau !"})
            if len(data.get(jour)) < 2:
                raise serializers.ValidationError({"erreur":f"Le jour {jour} doit contenir au moins deux séances !"})
            donnees[jour]=[]
            for i,seance in enumerate(data.get(jour)):
                if isinstance(seance, dict) and seance:
                    serializer=SeanceSerializer(data=seance, context={
                        "date":dates.get(jour.lower()),
                        "horaire":horaire
                    })
                    serializer.is_valid(raise_exception=True)
                    donnees[jour].append(serializer.validated_data)
                elif seance=={} or seance==[]:
                    donnees[jour].append({})
                else:
                    raise serializers.ValidationError({"erreur":"Format de données par chaque case invalide !"})
        return donnees

class EdtTableSerializer(serializers.Serializer):
    titre=serializers.ListField()
    contenu=serializers.ListField()

    def validate_titre(self, value):
        jours=["lundi","mardi","mercredi","jeudi","vendredi","samedi"]
        if len(value) != 2:
            raise serializers.ValidationError({"erreur":"Format de la titre invalide !"})
        if not isinstance(value[0], dict):
            raise serializers.ValidationError({"erreur":"Format de la titre invalide !"})
        if not isinstance(value[1], object):
            raise serializers.ValidationError({"erreur":"Format de la titre invalide !"})
        
        dsDonnee=value[0]
        npDonnee=NiveauParcours.objects.filter(pk=value[1]).first()

        if not isinstance(dsDonnee, dict):
            raise serializers.ValidationError({"erreur":"Format de la titre invalide !"})
        if len(dsDonnee) != 6:
            raise serializers.ValidationError({"erreur":"L'emploi du temps doit contenir le date de Lundi au Samedi"})
        dsJours=list(map(str.lower, list(dsDonnee.keys())))
        if any(jour not in jours for jour in dsJours):
            raise serializers.ValidationError({"erreur":"Format de jour invalide !"})
        
        dsSerializer=JourSerializer(data=dsDonnee)
        classe=ClasseSerializer(Classe.objects.filter(niveau=npDonnee.niveau), many=True).data
        serializerClasse=ClasseSerializer(data=classe, many=True)
        parcours=ParcoursSerializer(npDonnee.numParcours).data
        serializerParcours=ParcoursSerializer(data=parcours)

        if not dsSerializer.is_valid():
            raise serializers.ValidationError(dsSerializer.errors)
        if not serializerClasse.is_valid():
            raise serializers.ValidationError(serializerClasse.errors)
        if not serializerParcours.is_valid():
            raise serializers.ValidationError(serializerParcours.errors)
        return value
    
    def validate(self, data):

        titre=data["titre"]

        serializer=ContenuSerializer(data=data['contenu'], many=True, context={
            "dates":titre[0]
        })
        if serializer.is_valid():
            data['contenu']=serializer.validated_data
            return data
        raise serializers.ValidationError(serializer.errors)