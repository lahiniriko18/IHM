from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from ...serializer.serializerProfesseur import ProfesseurSerializer
from ...serializer.serializerMatiere import MatiereSerializer
from ...models import Professeur,NiveauParcours,Matiere
import os

class ProfesseurDetailView(APIView):
    def get(self, request, numProfesseur):
        try:
            professeur=Professeur.objects.get(pk=numProfesseur)
        except Professeur.DoesNotExist:
            return Response({"erreur":"Professeur introuvable !"}, status=status.HTTP_404_NOT_FOUND)
        donnee=ProfesseurSerializer(professeur).data
        matieres=Matiere.objects.filter(enseigners__numProfesseur__numProfesseur=numProfesseur)
        donnee['matieres']=MatiereSerializer(matieres, many=True).data
        if donnee['photos']:
            verifChemin=os.path.join(settings.MEDIA_ROOT, donnee['photos'])
            if os.path.exists(verifChemin):
                donnee['photos']=request.build_absolute_uri(settings.MEDIA_URL + donnee['photos'])
            else:
                donnee['photos']=''
        
        return Response(donnee,status=status.HTTP_200_OK)
    
    def delete(self, request):
        numProfesseurs=request.data.get('numProfesseurs',[])
        if not isinstance(numProfesseurs, list):
            numProfesseurs=request.data.getlist('numProfesseurs[]')

        if any(isinstance(numProfesseur, str) for numProfesseur in numProfesseurs):
            return Response({"erreur":"Type de données invalide !"})

        professeurs=Professeur.objects.filter(numProfesseur__in=numProfesseurs)
        if professeurs:
            for professeur in professeurs:
                professeur.delete()
            return Response({"Suppression avec succès !"},status=status.HTTP_200_OK)
        return Response({"erreur":"Professeurs introuvables !"}, status=status.HTTP_404_NOT_FOUND)


class ProfesseurNiveauParcoursView(APIView):
    def get(self, request, numNiveauParcours):
        niveauParcours=NiveauParcours.objects.filter(pk=numNiveauParcours).exists()
        if niveauParcours:
            numMatieres=Matiere.objects.filter(posseders__numNiveauParcours__numNiveauParcours=numNiveauParcours).values_list('numMatiere', flat=True)
            professeurs=Professeur.objects.filter(enseigners__numMatiere__numMatiere__in=numMatieres).distinct()
            donnees=ProfesseurSerializer(professeurs, many=True).data
            for i,prof in enumerate(professeurs):
                matieres=Matiere.objects.filter(enseigners__numProfesseur__numProfesseur=prof.numProfesseur)
                donnees[i]['matieres']=MatiereSerializer(matieres, many=True).data
                if donnees[i]['photos']:
                    verifChemin=os.path.join(settings.MEDIA_ROOT, donnees[i]['photos'])
                    if os.path.exists(verifChemin):
                        donnees[i]['photos']=request.build_absolute_uri(settings.MEDIA_URL + donnees[i]['photos'])
                    else:
                        donnees[i]['photos']=''
            return Response(donnees, status=status.HTTP_200_OK)
        
        return Response({"erreur":"Niveau avec parcours introuvable !"},status=status.HTTP_404_NOT_FOUND)