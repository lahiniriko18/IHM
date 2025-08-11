from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from django.db.models.functions import TruncWeek
from django.db.models import Min, Max
from ...serializers.serializerEdt import EdtSerializer
from ...models import Edt
from ....etablissements.models import NiveauParcours
from ...services.serviceEdt import ServiceEdtCrud
from common.services.serviceModel import ServiceModelCrud


class EdtView(APIView):
    def get(self, request):
        edtSemaines = (
            Edt.objects.annotate(semaine=TruncWeek("date"))
            .values("semaine", "numClasse__niveau", "numParcours")
            .annotate(dateDebut=Min("date"), dateFin=Max("date"))
            .order_by("semaine")
        )

        donnees = []
        for edtSemaine in edtSemaines:
            niveauParcours = (
                NiveauParcours.objects.filter(
                    niveau=edtSemaine["numClasse__niveau"],
                    numParcours=edtSemaine["numParcours"],
                )
                .values("numNiveauParcours", "niveau", "numParcours__codeParcours")
                .first()
            )
            lundi = edtSemaine["dateDebut"] - timedelta(
                days=edtSemaine["dateDebut"].weekday()
            )
            samedi = lundi + timedelta(days=5)
            donnee = {
                "niveauParcours": f"{niveauParcours['niveau']} {niveauParcours['numParcours__codeParcours']}",
                "dateDebut": datetime.strftime(lundi, "%d-%m-%Y"),
                "dateFin": datetime.strftime(samedi, "%d-%m-%Y"),
            }
            numEdts = Edt.objects.filter(
                numClasse__niveau=edtSemaine["numClasse__niveau"],
                numParcours=edtSemaine["numParcours"],
                date__range=(edtSemaine["dateDebut"], edtSemaine["dateFin"]),
            ).values_list("numEdt", flat=True)
            donnee["numEdts"] = list(numEdts)

            donnees.append(donnee)

        donnees = sorted(donnees, key=lambda d: sum(d["numEdts"]), reverse=True)
        return Response(donnees)

    def post(self, request):
        serializer = EdtSerializer(data=request.data)
        if serializer.is_valid():
            edt = serializer.save()
            return Response(EdtSerializer(edt).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, numEdt):
        try:
            edt = Edt.objects.get(pk=numEdt)
        except Edt.DoesNotExist:
            return Response(
                {"erreur": "Emploi du temps introuvable"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = EdtSerializer(edt, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, numEdt):
        try:
            edt = Edt.objects.get(pk=numEdt)
            edt.delete()
            return Response(
                {"message": "Suppression avec succès"}, status=status.HTTP_200_OK
            )
        except Edt.DoesNotExist:
            return Response(
                {"erreur": "Emploi du temps introuvable"},
                status=status.HTTP_404_NOT_FOUND,
            )


class ListeEdtView(APIView):

    def post(self, request):
        jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
        edtCrudInstance = ServiceEdtCrud()
        response = edtCrudInstance.ajoutEdtListeDonnee(request.data["donnee"], jours)
        return Response(response["context"], status=response["status"])

    def put(self, request):
        data = request.data.get("donnee")
        jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

        edtCrudInstance = ServiceEdtCrud()
        serviceCrud = ServiceModelCrud(Edt)

        d = {"numEdts": data.get("titre")[2]}
        responseSup = serviceCrud.suppressionMutlipe(d, "numEdts", "Emploi du temps")
        if responseSup["status"] == status.HTTP_401_UNAUTHORIZED:
            print("Tsy mety")
            return Response(responseSup["context"], status=responseSup["status"])

        print("Mety")
        response = edtCrudInstance.ajoutEdtListeDonnee(data, jours)
        return Response(response["context"], status=response["status"])


class EdtTableauView(APIView):
    def post(self, request):
        serviceCrud = ServiceModelCrud(Edt)
        response = serviceCrud.suppressionMutlipe(
            request.data, "numEdts", "Emploi du temps"
        )
        return Response(response["context"], status=response["status"])
