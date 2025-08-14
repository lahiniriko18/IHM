from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from common.utils.date_utils import get_semaine_by_date
from ...models import Edt
from common.services.serviceEdt import listeEdtParNumEdts
from ....etablissements.models import NiveauParcours


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
        numNiveauParcours = request.data.get("numNiveauParcours")
        print(request.data)
        if dateStr and numNiveauParcours and isinstance(numNiveauParcours, list):
            if len(numNiveauParcours) > 0:
                lundi, samedi = get_semaine_by_date(dateStr, 5)
                niveauParcours = NiveauParcours.objects.filter(pk__in=numNiveauParcours)
                donnees = {}
                if niveauParcours:
                    for np in niveauParcours:
                        numEdts = Edt.objects.filter(
                            date__range=(lundi, samedi),
                            numClasse__niveau=np.niveau,
                            numParcours=np.numParcours,
                        ).values_list("numEdt", flat=True)
                        response = listeEdtParNumEdts(sorted(list(numEdts)))
                        donnees[f"{np.niveau} {np.numParcours.codeParcours}"] = (
                            response["context"]
                        )

                    return Response({"donnee": donnees}, status=response["status"])
                return Response(
                    {"error": "Niveau parcours introuvable"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                {"error": "Niveau parcours invalide"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Date ou niveau introuvable"}, status=status.HTTP_400_BAD_REQUEST
        )
