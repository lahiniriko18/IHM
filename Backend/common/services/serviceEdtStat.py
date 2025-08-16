from api.edt.models import Edt
from api.etablissements.models import NiveauParcours
from ..utils.date_utils import get_semaine_by_date
from .serviceEdt import listeEdtParNumEdts


def get_edt_par_niveauParcours_date(dateStr, numNiveauParcours):
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
            donnee = response["context"]
            if donnee:
                donnee["numNiveauParcours"] = np.numNiveauParcours
                donnees[f"{np.niveau} {np.numParcours.codeParcours}"] = donnee
    return donnees
