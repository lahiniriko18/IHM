from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import Edt, Action
from ...professeurs.models import Professeur,Matiere
from ...etablissements.models import Parcours, Salle, Classe, Mention


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
