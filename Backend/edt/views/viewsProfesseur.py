from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerProfesseur import ProfesseurSerializer
from ..models import Professeur
class ProfesseurView(APIView):
    def get(self, request):
        professeurs=Professeur.objects.all()
        serializer=ProfesseurSerializer(professeurs, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer=ProfesseurSerializer(data=request.data)
        if serializer.is_valid():
            professeur=serializer.save()
            return Response(ProfesseurSerializer(professeur).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numProfesseur):
        try:
            professeur=Professeur.objects.get(pk=numProfesseur)
        except Professeur.DoesNotExist:
            return Response({"erreur":"Professeur introuvable !"}, status=status.HTTP_404_NOT_FOUND)
        serializer=ProfesseurSerializer(professeur, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numProfesseur):
        try:
            professeur=Professeur.objects.get(pk=numProfesseur)
            professeur.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except professeur.DoesNotExist:
            return Response({'erreur':'Professeur introuvable !'}, status=status.HTTP_404_NOT_FOUND)