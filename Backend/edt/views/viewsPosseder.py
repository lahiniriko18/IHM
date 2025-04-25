from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerPosseder import PossederSerializer
from ..models import Posseder
class PossederView(APIView):
    def get(self, request):
        posseders=Posseder.objects.all()
        serializer=PossederSerializer(posseders, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer=PossederSerializer(data=request.data)
        if serializer.is_valid():
            posseder=serializer.save()
            return Response(PossederSerializer(posseder).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numPosseder):
        try:
            posseder=Posseder.objects.get(pk=numPosseder)
        except Posseder.DoesNotExist:
            return Response({"erreur":"Posseder introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=PossederSerializer(posseder, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numPosseder):
        try:
            posseder=Posseder.objects.get(pk=numPosseder)
            posseder.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Posseder.DoesNotExist:
            return Response({'erreur':'Posseder introuvable'}, status=status.HTTP_404_NOT_FOUND)