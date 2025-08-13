from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializers.serializerProfesseur import ProfesseurStatSerializer
from ...models import Professeur
from datetime import datetime, timedelta
from ....edt.models import Edt
from common.services.serviceEdt import listeEdtParNumEdts
from common.utils.date_utils import get_semaine_by_date


class ProfesseurHoraireView(APIView):
    def post(self, request):
        serializer = ProfesseurStatSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            donnee = serializer.validated_data
            professeur = Professeur.objects.filter(pk=donnee["numProfesseur"]).exists()
            if professeur:
                edts = Edt.objects.filter(
                    date__range=(donnee["dateDebut"], donnee["dateFin"]),
                    numProfesseur=donnee["numProfesseur"],
                )
                heureTotal = timedelta()
                for edt in edts:
                    debut = datetime.combine(datetime.today(), edt.heureDebut)
                    fin = datetime.combine(datetime.today(), edt.heureFin)
                    heureTotal += fin - debut
                heures = heureTotal.total_seconds() // 3600
                minutes = (heureTotal.total_seconds() % 3600) // 60

                return Response(
                    f"{int(heures):02d}h {int(minutes):02d}min",
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"error": "Professeur introuvable !"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(
            {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )

class ProfesseurEdtSemaineView(APIView):
    def post(self, request):
        dateStr = request.data.get("date")
        if dateStr:
            lundi, samedi = get_semaine_by_date(dateStr, 5)
            numEdts = Edt.objects.filter(date__range=(lundi, samedi)).values_list(
                "numEdt", flat=True
            )

            response = listeEdtParNumEdts(numEdts)
            return Response({"donnee": response["context"]}, status=response["status"])
        return Response(
            {"error": "Date introuvable !"}, status=status.HTTP_400_BAD_REQUEST
        )
