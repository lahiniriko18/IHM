from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerMatiere import MatiereSerializer
from ..serializer.serializerNiveauParcours import NiveauParcoursSerializer
from ..models import Matiere
class MatiereView(APIView):
    def get(self, request):
        matieres=Matiere.objects.all()
        serializer=MatiereSerializer(matieres, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        donnees=request.data
        
        niveauParcours=donnees.get('niveauParcours')
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
                serializerNp=NiveauParcoursSerializer(data=donneeNp, many=True)
                if serializerNp.is_valid():
                    serializerNp.save()
                else:
                    return Response(serializerNp.errors, status=status.HTTP_400_BAD_REQUEST)
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