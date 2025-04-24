from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerClasse import ClasseSerializer
from ..models import Classe
class ClasseView(APIView):
    def get(self, request):
        classes=Classe.objects.all()
        serializer=ClasseSerializer(classes, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer=ClasseSerializer(data=request.data)
        if serializer.is_valid():
            classe=serializer.save()
            return Response(ClasseSerializer(classe).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numClasse):
        try:
            classe=Classe.objects.get(pk=numClasse)
        except Classe.DoesNotExist:
            return Response({"erreur":"Classe introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=ClasseSerializer(classe, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numClasse):
        try:
            classe=Classe.objects.get(pk=numClasse)
            classe.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Classe.DoesNotExist:
            return Response({'erreur':'Classe introuvable'}, status=status.HTTP_404_NOT_FOUND)