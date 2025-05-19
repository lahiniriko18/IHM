from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerEnseigner import EnseignerSerializer
from ..models import Enseigner
class EnseignerView(APIView):
    def get(self, request):
        enseigners=Enseigner.objects.all().order_by('-numEnseigner')
        serializer=EnseignerSerializer(enseigners, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer=EnseignerSerializer(data=request.data)
        if serializer.is_valid():
            enseigner=serializer.save()
            return Response(EnseignerSerializer(enseigner).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numEnseigner):
        try:
            enseigner=Enseigner.objects.get(pk=numEnseigner)
        except Enseigner.DoesNotExist:
            return Response({"erreur":"Enseigner introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=EnseignerSerializer(enseigner, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numEnseigner):
        try:
            enseigner=Enseigner.objects.get(pk=numEnseigner)
            enseigner.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Enseigner.DoesNotExist:
            return Response({'erreur':'Enseigner introuvable'}, status=status.HTTP_404_NOT_FOUND)