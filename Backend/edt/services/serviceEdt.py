from datetime import timedelta,datetime
from rest_framework import status
from ..serializer.serializerEdt import EdtSerializer
from ..serializer.serializerNiveauParcours import NiveauParcoursSerializer
from ..models import Edt,Classe
from collections import defaultdict
from datetime import datetime
from ..serializer.serializerEdt import EdtSerializer,EdtTableSerializer
from ..serializer.serializerConstituer import ConstituerSerializer
from ..serializer.serializerNiveauParcours import NiveauParcoursSerializer
from ..models import Edt,Constituer,NiveauParcours


class EdtListage:
    def listeEdtParNumEdts(self, numEdts):
        edts=Edt.objects.filter(numEdt__in=numEdts).order_by('heureDebut')
        if edts:
            titre=[]
            premierEdt=Edt.objects.filter(numEdt__in=numEdts).first()
            lundi=premierEdt.date - timedelta(days=premierEdt.date.weekday())

            jours=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]
            dates={}
            for i,jour in enumerate(jours):
                dates[jour]=datetime.strftime(lundi+timedelta(days=i), "%d-%m-%Y")
            titre.append(dates)

            niveauParcours=premierEdt.numParcours.niveauParcours.filter(niveau=premierEdt.numClasse.niveau).first()
            npDonnee=NiveauParcoursSerializer(niveauParcours).data
            titre.append(niveauParcours.numNiveauParcours)
            titre.append(list(edts.values_list("numEdt",flat=True)))

            donnees={"titre":titre}
            contenu=[]
            nbGroupe=Classe.objects.filter(niveau=niveauParcours.niveau, constituers__numParcours__numParcours=npDonnee['numParcours']).count()
            edtGroupe=defaultdict(list)

            for edt in edts:
                edtGroupe[f"{edt.heureDebut}-{edt.heureFin}"].append(edt)

            for horaire,groupeEdt in edtGroupe.items():
                donnee={
                    "Horaire":{
                        "heureDebut":horaire.split("-")[0],
                        "heureFin":horaire.split("-")[1]
                    }
                }
                edtJour=defaultdict(list)
                for edt in groupeEdt:
                    edtDonnee=EdtSerializer(edt).data
                    d={
                        "numEdt":edt.numEdt,
                        "numMatiere":edtDonnee['numMatiere'],
                        "numParcours":edtDonnee['numParcours'],
                        "numSalle":edtDonnee['numSalle'],
                        "numClasse":edtDonnee['numClasse']
                    }
                    jourCle=next((k for k,v in dates.items() if v==datetime.strftime(edt.date, "%d-%m-%Y")), None)
                    edtJour[jourCle].append(d)

                for jour in jours:
                    edtJour[jour]+=[{}]*(nbGroupe-len(edtJour[jour]))
                donnee=donnee|edtJour
                contenu.append(donnee)

            donnees["contenu"]=contenu
            return {
                "context":donnees,
                "status":status.HTTP_200_OK
            }
        return {
                "context":EdtSerializer(edts, many=True).data,
                "status":status.HTTP_200_OK
            }
    

class EdtCrud:
    def ajoutEdtListeDonnee(self,data,jours):
        serializer=EdtTableSerializer(data=data)
        
        if serializer.is_valid():
            donnee = serializer.validated_data
            contenu=donnee["contenu"]
            dates=donnee["titre"][0]
            niveauParcours=NiveauParcours.objects.filter(pk=donnee["titre"][1]).first()
            npDonnee=NiveauParcoursSerializer(niveauParcours).data

            if len(contenu) > 1:
                heureCourant=contenu[0]["Horaire"]["heureFin"]
                for i in range(1,len(contenu)):
                    if heureCourant > contenu[i]["Horaire"]["heureDebut"]:
                        return {
                            "context":{"erreur":f"L'heure de fin dans la ligne {i} doit inférieure ou égale à l'heure de début de la ligne {i+1} dans le colonne de horaire !"},
                            "status":status.HTTP_203_NON_AUTHORITATIVE_INFORMATION
                        }
                    heureCourant=contenu[i]["Horaire"]["heureFin"]

            if len(contenu) > 0:
                
                donneEdts=[]
                donneeConstituer=[]
                for ligne in contenu:
                    horaire=ligne["Horaire"]
                    for jour in jours:
                        valeurJour=ligne.get(jour)
                        for val in valeurJour:
                            if isinstance(val, dict) and val:
                                dateObj=datetime.strptime(dates.get(jour),"%d-%m-%Y")
                                dateSql=dateObj.strftime("%Y-%m-%d")
                                
                                constiuer=Constituer.objects.filter(numClasse=val['classe'], numParcours=npDonnee['numParcours']).exists()
                                if not constiuer:
                                    donneeConstituer.append({
                                        "numParcours":npDonnee['numParcours'],
                                        "numClasse":val['classe']
                                    })
                                donneEdt={
                                    "numMatiere":val["matiere"],
                                    "numParcours":npDonnee['numParcours'],
                                    "numSalle":val["salle"],
                                    "numClasse":val['classe'],
                                    "date":dateSql,
                                    "heureDebut":horaire["heureDebut"],
                                    "heureFin":horaire["heureFin"]
                                }
                                donneEdts.append(donneEdt)

                serializerConstituer = ConstituerSerializer(data=donneeConstituer, many=True)
                if serializerConstituer.is_valid():
                    serializerConstituer.save()
                serializerEdt= EdtSerializer(data=donneEdts, many=True)
                if serializerEdt.is_valid():
                    serializerEdt.save()
                else:
                    return {
                        "context":serializerEdt.errors,
                        "status":status.HTTP_401_UNAUTHORIZED
                    }
                
            return {
                "context":{"message":"Ajout d'emploi du temps avec succès !"},
                "status":status.HTTP_200_OK
            }
        return {
            "context":serializer.errors,
            "status":status.HTTP_401_UNAUTHORIZED
        }
    
    def supprimerEdtListe(self, data):
        numEdts=data.get('numEdts',[])
        if not isinstance(numEdts, list):
            numEdts=data.getlist('numEdts[]')

        if any(isinstance(numEdt, str) for numEdt in numEdts):
            return {
                "context":{"erreur":"Type de données invalide !"},
                "status":status.HTTP_401_UNAUTHORIZED
            }

        edts=Edt.objects.filter(numEdt__in=numEdts)
        if edts:
            for edt in edts:
                edt.delete()
            return {
                "context":{"Suppression avec succès !"},
                "status":status.HTTP_200_OK
            }
        return {
            "context":{"erreur":"Emploi du temps introuvable !"},
            "status":status.HTTP_404_NOT_FOUND
        }