from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerSalle import SalleSerializer
from ..models import Salle
class SalleView(APIView):
    def get(self, request):
        salles=Salle.objects.all()
        serializer=SalleSerializer(salles, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer=SalleSerializer(data=request.data)
        if serializer.is_valid():
            salle=serializer.save()
            return Response(SalleSerializer(salle).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numSalle):
        try:
            salle=Salle.objects.get(pk=numSalle)
        except Salle.DoesNotExist:
            return Response({"erreur":"Salle introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=SalleSerializer(salle, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numSalle):
        try:
            salle=Salle.objects.get(pk=numSalle)
            salle.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Salle.DoesNotExist:
            return Response({'erreur':'Salle introuvable'}, status=status.HTTP_404_NOT_FOUND)