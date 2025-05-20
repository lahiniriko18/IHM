from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models.functions import TruncWeek
from django.db.models import Min,Max
from datetime import datetime
from ...serializer.serializerEdt import EdtSerializer,EdtTableSerializer
from ...serializer.serializerConstituer import ConstituerSerializer
from ...serializer.serializerNiveauParcours import NiveauParcoursSerializer
from ...models import Edt,Constituer,NiveauParcours


class EdtView(APIView):
    def get(self, request):
        edtSemaines=(
            Edt.objects.annotate(semaine=TruncWeek('date'))
            .values('semaine','numClasse__niveau','numParcours')
            .annotate(
                dateDebut=Min('date'),
                dateFin=Max('date')
            )
            .order_by('semaine')
        )
        
        donnees=[]
        for edtSemaine in edtSemaines:
            niveauParcours=NiveauParcours.objects.filter(
                niveau=edtSemaine['numClasse__niveau'],
                numParcours=edtSemaine['numParcours']).values('numNiveauParcours','niveau','numParcours__codeParcours').first()
            donnee={
                'niveauParcours':f"{niveauParcours['niveau']} {niveauParcours['numParcours__codeParcours']}",
                'dateDebut':edtSemaine['dateDebut'],
                'dateFin':edtSemaine['dateFin']
            }
            numEdts=Edt.objects.filter(
                numClasse__niveau=edtSemaine['numClasse__niveau'],
                numParcours=edtSemaine['numParcours'],
                date__range=(edtSemaine['dateDebut'],edtSemaine['dateFin'])
                ).values_list('numEdt',flat=True)
            donnee['numEdts']=list(numEdts)
            
            donnees.append(donnee)

        return Response(donnees)
    
    def post(self, request):
        serializer=EdtSerializer(data=request.data)
        if serializer.is_valid():
            edt=serializer.save()
            return Response(EdtSerializer(edt).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numEdt):
        try:
            edt=Edt.objects.get(pk=numEdt)
        except Edt.DoesNotExist:
            return Response({"erreur":"Emploi du temps introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=EdtSerializer(edt, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numEdt):
        try:
            edt=Edt.objects.get(pk=numEdt)
            edt.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Edt.DoesNotExist:
            return Response({'erreur':'Emploi du temps introuvable'}, status=status.HTTP_404_NOT_FOUND)


class EdtTableauView(APIView):
    def post(self, request):
        donnees=request.data
        donneeAjout = []
        if isinstance(donnees, list):
            return Response({"erreur":"Format de données invalide"})
        for donnee in donnees:
            serializer=EdtSerializer(data=donnee)
            if serializer.is_valid():
                edt=serializer.save()
                donneeAjout.append(EdtSerializer(edt).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(donneeAjout,status=status.HTTP_201_CREATED)
    

class ListeEdtView(APIView):
    def post(self, request):
        jours=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
        data=request.data['donnee']
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
                        return Response({"erreur":f"L'heure de fin dans la ligne {i} doit inférieure ou égale à l'heure de début de la ligne {i+1} dans le colonne de horaire !"})
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
                    return Response(serializerEdt.errors, status=status.HTTP_400_BAD_REQUEST)
                
            return Response({"message":"Fichier traité et ajout d'emploi du temps avec succès !"}, status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_401_UNAUTHORIZED)