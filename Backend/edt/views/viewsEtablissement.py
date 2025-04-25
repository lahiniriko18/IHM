from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerEtablissement import EtablissementSerializer
from ..models import Etablissement


class EtablissementView(APIView):
    def get(self, request):
        etablissements=Etablissement.objects.all()
        serializer=EtablissementSerializer(etablissements, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer=EtablissementSerializer(data=request.data)
        if serializer.is_valid():
            etablissement=serializer.save()
            return Response(EtablissementSerializer(etablissement).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numEtablissement):
        try:
            etablissement= Etablissement.objects.get(pk=numEtablissement)
        except Etablissement.DoesNotExist:
            return Response({"erreur":"Etablissement introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=EtablissementSerializer(etablissement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numEtablissement):
        try:
            etablissement= Etablissement.objects.get(pk=numEtablissement)
            etablissement.delete()
            return Response({"message":"Suppression avec succès"}, status=status.HTTP_200_OK)
        except Etablissement.DoesNotExist:
            return Response({'erreur':'Etablissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
