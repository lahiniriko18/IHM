from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta,datetime
from ...serializer.serializerEdt import EdtSerializer
from ...serializer.serializerNiveauParcours import NiveauParcoursSerializer
from ...models import Edt,Classe
from collections import defaultdict


class EdtDetailView(APIView):
    
    def post(self, request):
        donnee=request.data
        numEdts=donnee.get('numEdts',[])
        if not isinstance(numEdts, list):
            numEdts=donnee.getlist('numEdts[]')

        if any(isinstance(numEdt, str) for numEdt in numEdts):
            return Response({"erreur":"Type de données invalide !"})
        
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
            return Response(donnees)
        return Response(EdtSerializer(edts, many=True).data)