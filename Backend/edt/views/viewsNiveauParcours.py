from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerNiveauParcours import NiveauParcoursSerializer
from ..serializer.serializerParcours import ParcoursSerializer
from ..models import NiveauParcours
class NiveauParcoursView(APIView):
    def get(self, request):
        niveauParcours=NiveauParcours.objects.all().order_by('-numNiveauParcours')
        serializer=NiveauParcoursSerializer(niveauParcours, many=True)
        donnees=serializer.data
        for i,niveauParcour in enumerate(niveauParcours):
            donnees[i]["numParcours"]=ParcoursSerializer(niveauParcour.numParcours).data
        return Response(donnees)
    
    def post(self, request):
        serializer=NiveauParcoursSerializer(data=request.data)
        if serializer.is_valid():
            niveauParcour=serializer.save()
            return Response(NiveauParcoursSerializer(niveauParcour).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, numNiveauParcours):
        try:
            niveauParcour=NiveauParcours.objects.get(pk=numNiveauParcours)
        except NiveauParcours.DoesNotExist:
            return Response({"erreur":"Niveau avec parcours introuvable !"}, status=status.HTTP_404_NOT_FOUND)
        serializer=NiveauParcoursSerializer(niveauParcour, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numNiveauParcours):
        try:
            niveauParcour=NiveauParcours.objects.get(pk=numNiveauParcours)
            niveauParcour.delete()
            return Response({'message':'Suppression avec succès !'}, status=status.HTTP_200_OK)
        except NiveauParcours.DoesNotExist:
            return Response({'erreur':'Niveau avec parcours introuvable !'}, status=status.HTTP_404_NOT_FOUND)
        

class NiveauParcoursDetailView(APIView):
    def get(self, request, numNiveauParcours):
        niveauParcours=NiveauParcours.objects.filter(pk=numNiveauParcours).first()
        if niveauParcours:
            donnee=NiveauParcoursSerializer(niveauParcours).data
            donnee['numParcours']=ParcoursSerializer(niveauParcours.numParcours).data
            return Response(donnee, status=status.HTTP_200_OK)
        return Response({"erreur":"Niveau avec parcours introuvable !"},status=status.HTTP_404_NOT_FOUND)