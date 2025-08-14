from rest_framework.response import Response
from rest_framework.views import APIView

from ...etablissements.models import Classe, Mention, Parcours, Salle
from ...professeurs.models import Matiere, Professeur
from ..models import Action, Edt


class EffectifView(APIView):
    def get(self, request):
        effectifs = {
            "professeur": Professeur.objects.count(),
            "matiere": Matiere.objects.count(),
            "parcours": Parcours.objects.count(),
            "salle": Salle.objects.count(),
            "classe": Classe.objects.count(),
            "mention": Mention.objects.count(),
            "edt": Edt.objects.count(),
            "action": Action.objects.count(),
        }

        return Response(effectifs)
