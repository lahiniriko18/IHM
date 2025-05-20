from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializer.serializerMatiere import MatiereSerializer
from ...serializer.serializerNiveauParcours import NiveauParcoursSerializer
from ...serializer.serializerProfesseur import ProfesseurSerializer
from ...models import Matiere,NiveauParcours,Professeur

class MatiereDetailView(APIView):
    def get(self, request, numMatiere):
        matiere=Matiere.objects.filter(pk=numMatiere).first()
        if matiere:
            donnee=MatiereSerializer(matiere).data
            niveauParcours=NiveauParcours.objects.filter(posseders__numMatiere__numMatiere=numMatiere)
            donnee['niveauParcours']=NiveauParcoursSerializer(niveauParcours, many=True).data
            professeurs=Professeur.objects.filter(enseigners__numMatiere__numMatiere=numMatiere)
            donnee['professeurs']=ProfesseurSerializer(professeurs, many=True).data
            return Response(donnee,status=status.HTTP_200_OK)
        
        return Response({"erreur":"Matiere introuvable !"}, status=status.HTTP_404_NOT_FOUND)   

    def delete(self, request):
        numMatieres=request.data.get('numMatieres',[])
        if not isinstance(numMatieres, list):
            numMatieres=request.data.getlist('numMatieres[]')

        if any(isinstance(numMatiere, str) for numMatiere in numMatieres):
            return Response({"erreur":"Type de données invalide !"})

        matieres=Matiere.objects.filter(numMatiere__in=numMatieres)
        if matieres:
            for matiere in matieres:
                matiere.delete()
            return Response({"Suppression avec succès !"},status=status.HTTP_200_OK)
        return Response({"erreur":"Matières introuvables !"}, status=status.HTTP_404_NOT_FOUND)


class MatiereNiveauParcoursView(APIView):
    def get(self, request, numNiveauParcours):
        niveauParcours=NiveauParcours.objects.filter(pk=numNiveauParcours).exists()
        if niveauParcours:
            matieres=Matiere.objects.filter(posseders__numNiveauParcours__numNiveauParcours=numNiveauParcours)
            return Response(MatiereSerializer(matieres, many=True).data, status=status.HTTP_200_OK)
        
        return Response({"erreur":"Niveau avec parcours introuvable !"},status=status.HTTP_404_NOT_FOUND)