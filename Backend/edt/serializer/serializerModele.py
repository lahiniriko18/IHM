from rest_framework import serializers
from ..models import NiveauParcours,Classe
from ..serializer.serializerNiveauParcours import NiveauParcoursSerializer
from datetime import date,datetime,timedelta
import locale

class ModeleEdtSerializer(serializers.Serializer):
    typeFichier=serializers.IntegerField()
    niveauParcours=serializers.IntegerField()
    dateDebut=serializers.CharField(
        allow_null=True,
        required=False
    )
    dateFin=serializers.CharField(
        allow_null=True,
        required=False
    )

    def validate(self, data):
        donnees={}
        if data['typeFichier'] not in [1,2]:
            raise serializers.ValidationError({"erreur":"Type de fichier invalide !"})
        
        donnees['typeFichier']=data['typeFichier']

        niveauParcours=NiveauParcours.objects.filter(pk=data['niveauParcours']).first()
        if not niveauParcours:
            raise serializers.ValidationError({"erreur":"Niveau avec parcours introuvable !"})
        npDonnee=NiveauParcoursSerializer(niveauParcours).data
        nbGroupe=Classe.objects.filter(niveau=niveauParcours.niveau, constituers__numParcours__numParcours=npDonnee['numParcours']).count()
        nbGroupe=2 if nbGroupe<2 else nbGroupe
        parcours=niveauParcours.numParcours

        donnees['nbCase']=nbGroupe
        donnees['niveau']=niveauParcours.niveau
        donnees['parcours']=parcours.codeParcours

        locale.setlocale(locale.LC_TIME, 'fr_FR.UTF-8')
        dateDonnee=date.today()
        dateDonnee = dateDonnee + timedelta(days=7)
        if data.get('dateDebut') and data.get('dateFin'):
            dateDonnee=data.get('dateDebut')
            if isinstance(data.get('dateDebut'), str):
                try:
                    dateDonnee=datetime.strptime(data.get('dateDebut'),"%d-%m-%Y")
                except ValueError:
                    raise serializers.ValidationError({"erreur":"Format de date invalide !"})
        lundi=dateDonnee - timedelta(days=dateDonnee.weekday())
        samedi=lundi+timedelta(days=5)

        jourDebut= lundi.day
        moisDebut= lundi.strftime("%B").capitalize()
        jourFin= samedi.day
        moisFin= samedi.strftime("%B").capitalize()
        anneeDebut= lundi.year
        anneeFin= samedi.year

        if anneeDebut != anneeFin:
            donnees['titre']=f"{jourDebut:02d} {moisDebut} {anneeDebut} au {jourFin:02d} {moisFin} {anneeFin}"
        elif moisDebut != moisFin:
            donnees['titre']=f"{jourDebut:02d} {moisDebut} au {jourFin:02d} {moisFin} {anneeFin}"
        else:
            donnees['titre']=f"{jourDebut:02d} au {jourFin:02d} {moisFin} {anneeFin}"
        return donnees