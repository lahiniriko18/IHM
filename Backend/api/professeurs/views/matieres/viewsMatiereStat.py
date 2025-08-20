from django.db.models import Count, F, Value
from django.db.models.functions import Concat
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ....etablissements.models import NiveauParcours


class EffectifMatiereParNiveauView(APIView):
    def get(self, request):
        matiereNiveau = (
            NiveauParcours.objects.annotate(
                niveauParcours=Concat(
                    F("niveau"), Value(" "), F("numParcours__codeParcours")
                )
            )
            .annotate(effectif=Count("posseders__numMatiere"))
            .values("niveauParcours", "effectif")
        )
        return Response(matiereNiveau)
