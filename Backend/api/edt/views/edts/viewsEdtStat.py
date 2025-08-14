from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from common.utils.date_utils import get_semaine_by_date
from ...models import Edt
from common.services.serviceEdt import listeEdtParNumEdts


class EdtSemaineView(APIView):
    def post(self, request):
        dateStr = request.data.get("date")
        if dateStr:
            lundi, samedi = get_semaine_by_date(dateStr, 5)
            numEdts = Edt.objects.filter(date__range=(lundi, samedi)).values_list(
                "numEdt", flat=True
            )
            response = listeEdtParNumEdts(sorted(list(numEdts)))
            return Response({"donnee": response["context"]}, status=response["status"])

        return Response(
            {"error": "Date introuvable"}, status=status.HTTP_400_BAD_REQUEST
        )


class EdtNiveauSemaineView(APIView):
    def post(self, request):
        dateStr = request.data.get("date")
        niveau = request.data.get("niveau")
        if dateStr and niveau:
            lundi, samedi = get_semaine_by_date(dateStr, 5)
            numEdts = Edt.objects.filter(
                date__range=(lundi, samedi), numClasse__niveau=niveau
            ).values_list("numEdt", flat=True)
            response = listeEdtParNumEdts(sorted(list(numEdts)))
            return Response({"donnee": response["context"]}, status=response["status"])

        return Response(
            {"error": "Date ou niveau introuvable"}, status=status.HTTP_400_BAD_REQUEST
        )
