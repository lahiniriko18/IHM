from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerMatiere import MatiereSerializer
from ..serializer.serializerNiveauParcours import NiveauParcoursSerializer
from ..serializer.serializerPosseder import PossederSerializer
from ..models import Matiere,NiveauParcours
class MatiereView(APIView):
    def get(self, request):
        matieres=Matiere.objects.all()
        serializer=MatiereSerializer(matieres, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        donnees=request.data
        
        niveauParcours=donnees.get('niveauParcours')
        if not isinstance(niveauParcours, list):
            niveauParcours=donnees.getlist('niveauParcours[]')
        serializer=MatiereSerializer(data=request.data)
        if serializer.is_valid():
            matiere=serializer.save()
            if niveauParcours and len(niveauParcours) > 0:
                donneeNp=[]
                for niveauParcour in niveauParcours:
                    donneeNp.append({
                        "numNiveauParcours":niveauParcour,
                        "numMatiere":matiere.numMatiere
                    })
                serializerPossede=PossederSerializer(data=donneeNp, many=True)
                if serializerPossede.is_valid():
                    serializerPossede.save()
                else:
                    return Response(serializerPossede.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(MatiereSerializer(matiere).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numMatiere):
        try:
            matiere=Matiere.objects.get(pk=numMatiere)
        except Matiere.DoesNotExist:
            return Response({"erreur":"Matière introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=MatiereSerializer(matiere, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numMatiere):
        try:
            matiere=Matiere.objects.get(pk=numMatiere)
            matiere.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Matiere.DoesNotExist:
            return Response({'erreur':'Matière introuvable'}, status=status.HTTP_404_NOT_FOUND)
        
class MatiereDetailView(APIView):
    def get(self, request, numMatiere):
        try:
            matiere=Matiere.objects.get(pk=numMatiere)
        except Matiere.DoesNotExist:
            return Response({"erreur":"Matiere introuvable !"}, status=status.HTTP_404_NOT_FOUND)
        donnee=MatiereSerializer(matiere).data
        niveauParcours=[]
        posseders=matiere.posseders.filter()
        for possede in posseders:
            niveauParcours.append(NiveauParcoursSerializer(possede.numNiveauParcours).data)
        donnee['niveauParcours']=niveauParcours
        return Response(donnee,status=status.HTTP_200_OK)
    
