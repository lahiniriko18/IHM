from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerAvoir import AvoirSerializer
from ..models import Avoir
class AvoirView(APIView):
    def get(self, request):
        avoirs=Avoir.objects.all()
        serializer=AvoirSerializer(avoirs, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer=AvoirSerializer(data=request.data)
        if serializer.is_valid():
            avoir=serializer.save()
            return Response(AvoirSerializer(avoir).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, numAvoir):
        try:
            avoir=Avoir.objects.get(pk=numAvoir)
        except Avoir.DoesNotExist:
            return Response({"erreur":"Avoir introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=AvoirSerializer(avoir, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, numAvoir):
        try:
            avoir=Avoir.objects.get(pk=numAvoir)
            avoir.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Avoir.DoesNotExist:
            return Response({'erreur':'Avoir introuvable'}, status=status.HTTP_404_NOT_FOUND)