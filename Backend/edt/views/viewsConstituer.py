from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerConstituer import ConstituerSerializer
from ..models import Constituer
class ConstituerView(APIView):
    def get(self, request):
        constituers=Constituer.objects.all()
        serializer=ConstituerSerializer(constituers, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer=ConstituerSerializer(data=request.data)
        if serializer.is_valid():
            constituer=serializer.save()
            return Response(ConstituerSerializer(constituer).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numConstituer):
        try:
            constituer=Constituer.objects.get(pk=numConstituer)
        except Constituer.DoesNotExist:
            return Response({"erreur":"Constituer introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=ConstituerSerializer(constituer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numConstituer):
        try:
            constituer=Constituer.objects.get(pk=numConstituer)
            constituer.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Constituer.DoesNotExist:
            return Response({'erreur':'Constituer introuvable'}, status=status.HTTP_404_NOT_FOUND)