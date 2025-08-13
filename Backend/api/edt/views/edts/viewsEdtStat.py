from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from common.utils.date_utils import get_semaine_by_date
from ...models import Edt


class EdtSemaineView(APIView):
    def post(self, request):
        dateStr = request.data.get("date")
        if dateStr:
            lundi, samedi = get_semaine_by_date(dateStr, 5)
            edtSemaines = (
                Edt.objects.filter(date__range=(lundi, samedi))
                .values("numClasse__niveau", "numParcours")
                .order_by("date")
            )
            print(edtSemaines)
            return Response({"message": f"Edt du semaine de {lundi}-{samedi}"})
        return Response(
            {"error": "Date introuvable"}, status=status.HTTP_400_BAD_REQUEST
        )
