from django.urls import path

from ..views.matieres.viewsMatiere import MatiereView
from ..views.matieres.viewsMatiereDetail import (
    MatiereDetailView,
    MatiereNiveauParcoursView,
)
from ..views.matieres.viewsMatiereStat import EffectifMatiereParNiveauView

urlpatterns = [
    path("", MatiereView.as_view(), name="matiere"),
    path("<int:numMatiere>", MatiereDetailView.as_view(), name="matiere.uneMatiere"),
    path("ajouter/", MatiereView.as_view(), name="matiere.ajouter"),
    path("modifier/<int:numMatiere>", MatiereView.as_view(), name="matiere.modifier"),
    path("supprimer/<int:numMatiere>", MatiereView.as_view(), name="matiere.supprimer"),
    path(
        "supprimer/liste/", MatiereDetailView.as_view(), name="matiere.supprimer.liste"
    ),
    path(
        "niveau-parcours/<int:numNiveauParcours>",
        MatiereNiveauParcoursView.as_view(),
        name="matiere.niveauParcours",
    ),
    path(
        "effectif-par-niveau/",
        EffectifMatiereParNiveauView.as_view(),
    ),
]
