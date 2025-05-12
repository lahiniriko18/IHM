from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerGroupe import GroupeSerializer
from ..models import Groupe
class GroupeView(APIView):
    def get(self, request):
        groupes=Groupe.objects.all()
        serializer=GroupeSerializer(groupes, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer=GroupeSerializer(data=request.data)
        if serializer.is_valid():
            groupe=serializer.save()
            return Response(GroupeSerializer(groupe).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numGroupe):
        try:
            groupe=Groupe.objects.get(pk=numGroupe)
        except Groupe.DoesNotExist:
            return Response({"erreur":"Groupe introuvable !"}, status=status.HTTP_404_NOT_FOUND)
        serializer=GroupeSerializer(groupe, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numGroupe):
        try:
            groupe=Groupe.objects.get(pk=numGroupe)
            groupe.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Groupe.DoesNotExist:
            return Response({'erreur':'Groupe introuvable'}, status=status.HTTP_404_NOT_FOUND)