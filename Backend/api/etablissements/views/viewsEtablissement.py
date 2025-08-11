from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers.serializerEtablissement import EtablissementSerializer
from ..models import Etablissement
import os


class EtablissementView(APIView):
    def get(self, request):
        etablissements = Etablissement.objects.all().order_by("-numEtablissement")
        serializer = EtablissementSerializer(
            etablissements, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        donnees = request.data
        serializer = EtablissementSerializer(data=donnees, context={"request": request})

        if serializer.is_valid():
            etablissement = serializer.save()
            donnee = EtablissementSerializer(
                etablissement, context={"request": request}
            ).data
            return Response(donnee, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, numEtablissement):
        try:
            etablissement = Etablissement.objects.get(pk=numEtablissement)
        except Etablissement.DoesNotExist:
            return Response(
                {"erreur": "Etablissement introuvable"},
                status=status.HTTP_404_NOT_FOUND,
            )

        donnees = request.data
        serializer = EtablissementSerializer(
            etablissement, data=donnees, context={"request": request}
        )
        if serializer.is_valid():
            etablissements = serializer.save()
            donnee = EtablissementSerializer(
                etablissements, context={"request": request}
            ).data
            return Response(donnee, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, numEtablissement):
        try:
            etablissement = Etablissement.objects.get(pk=numEtablissement)
            etablissement.delete()
            return Response(
                {"message": "Suppression avec succès !"}, status=status.HTTP_200_OK
            )
        except Etablissement.DoesNotExist:
            return Response(
                {"erreur": "Etablissement introuvable !"},
                status=status.HTTP_404_NOT_FOUND,
            )
