from common.services.serviceEdtStat import get_edt_par_niveauParcours_date
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime
from django.db.models.functions import TruncMonth
from django.db.models import Count

from ...models import Edt


class EdtSemaineView(APIView):
    def post(self, request):
        dateStr = request.data.get("date")
        if dateStr:
            numNiveauParcours = Edt.objects.values_list(
                "numParcours__niveauParcours__numNiveauParcours", flat=True
            ).distinct()
            donnees = get_edt_par_niveauParcours_date(dateStr, numNiveauParcours)
            return Response({"donnee": donnees}, status=status.HTTP_200_OK)
        return Response(
            {"error": "Date introuvable"}, status=status.HTTP_400_BAD_REQUEST
        )


class EdtNiveauSemaineView(APIView):
    def post(self, request):
        dateStr = request.data.get("date")
        numNiveauParcours = request.data.get("numNiveauParcours")
        if dateStr and numNiveauParcours and isinstance(numNiveauParcours, list):
            if len(numNiveauParcours) > 0:
                donnees = get_edt_par_niveauParcours_date(dateStr, numNiveauParcours)
                return Response({"donnee": donnees}, status=status.HTTP_200_OK)
            return Response(
                {"error": "Niveau parcours introuvable"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Date ou niveau introuvable"}, status=status.HTTP_400_BAD_REQUEST
        )


class EdtProfesseurSemaineView(APIView):
    def post(self, request):
        dateStr = request.data.get("date")
        numProfesseur = request.data.get("numProfesseur")
        if dateStr and numProfesseur and isinstance(numProfesseur, int):
            numNiveauParcours = Edt.objects.filter(
                numProfesseur=numProfesseur
            ).values_list("numParcours__niveauParcours__numNiveauParcours", flat=True)
            donnees = get_edt_par_niveauParcours_date(dateStr, numNiveauParcours)
            return Response({"donnee": donnees}, status=status.HTTP_200_OK)
        return Response(
            {"error": "Date ou professeur introuvable"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class EdtEffectifMensuelleView(APIView):
    def get(self, request):
        today = datetime.now().date()
        edtEffetifs = (
            Edt.objects.filter(date__year=today.year)
            .annotate(mois=TruncMonth("date"))
            .values("mois")
            .annotate(nombre=Count("numEdt"))
            .order_by("mois")
        )
        moisNombres = {edt["mois"].month: edt["nombre"] for edt in edtEffetifs}
        listeMois = [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
        ]
        donnees = []
        for i, m in enumerate(listeMois):
            donnees.append({"mois": m, "nombre": moisNombres.get(i + 1, 0)})
        return Response(donnees)
