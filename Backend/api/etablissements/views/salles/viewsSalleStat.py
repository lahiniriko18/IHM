from datetime import datetime, timedelta

from common.utils.date_utils import get_semaine_by_date
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models.functions import TruncDate
from django.db.models import Count

from ....etablissements.models import NiveauParcours, Salle
from ...models import Salle
from ...serializers.serializerSalle import SalleSerializer, SalleStatSerializer
from ....edt.models import Edt


class SalleStatView(APIView):
    def get(self, request):
        serializer = SalleStatSerializer(data=request.data)
        if serializer.is_valid():
            donnee = serializer.validated_data
            salles = Salle.objects.all()
            donnees = SalleSerializer(salles, many=True).data

            for i, salle in enumerate(salles):
                edts = salle.edts.filter(
                    date__range=(donnee["dateDebut"], donnee["dateFin"])
                )
                heureTotal = timedelta()
                for edt in edts:
                    debut = datetime.combine(datetime.today(), edt.heureDebut)
                    fin = datetime.combine(datetime.today(), edt.heureFin)
                    heureTotal += fin - debut
                donnees[i]["heureTotal"] = heureTotal

            donnees = sorted(donnees, key=lambda edt: edt["heureTotal"], reverse=True)
            for donnee in donnees:
                h = donnee["heureTotal"].total_seconds() // 3600
                m = (donnee["heureTotal"].total_seconds() % 3600) // 60
                donnee["heureTotal"] = f"{int(h):02d}h {int(m):02d}min"
            return Response(donnees, status=status.HTTP_200_OK)
        return Response(
            {"erreur": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )


class SalleNiveauParcoursView(APIView):
    def get(self, request, numNiveauParcours):
        np = NiveauParcours.objects.filter(pk=numNiveauParcours).first()
        if np:
            salles = Salle.objects.filter(
                edts__numParcours=np.numParcours, edts__numClasse__niveau=np.niveau
            ).distinct()
            donnees = SalleSerializer(salles, many=True).data
            return Response(donnees)
        return Response(
            {"error": "Niveau parcours introuvable !"}, status=status.HTTP_404_NOT_FOUND
        )


class SalleOccupeParSemaineView(APIView):
    def get(self, request):
        today = datetime.now().date()
        lundi, samedi = get_semaine_by_date(today.strftime("%d-%m-%Y"), 5)
        edtEffetifs = (
            Edt.objects.filter(date__range=[lundi, samedi])
            .annotate(jour=TruncDate("date"))
            .values("jour")
            .annotate(nombre=Count("numSalle"))
            .order_by("jour")
        )
        jourNombres = {edt["jour"]: edt["nombre"] for edt in edtEffetifs}
        jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
        donnees = []
        for i in range(6):
            jour = lundi + timedelta(days=i)
            donnees.append(
                {"jour": jours[i], "nombre": jourNombres.get(jour.date(), 0)}
            )
        return Response(donnees)
