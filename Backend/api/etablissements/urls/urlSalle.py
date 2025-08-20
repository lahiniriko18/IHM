from django.urls import path

from ..views.salles.viewsSalle import SalleDetailView, SalleEdtView, SalleView
from ..views.salles.viewsSalleStat import (
    SalleStatView,
    SalleNiveauParcoursView,
    SalleOccupeParSemaineView,
)

urlpatterns = [
    path("", SalleView.as_view(), name="salle"),
    path("ajouter/", SalleView.as_view(), name="salle.ajouter"),
    path("modifier/<int:numSalle>", SalleView.as_view(), name="salle.modifier"),
    path("supprimer/<int:numSalle>", SalleView.as_view(), name="salle.supprimer"),
    path("supprimer/liste/", SalleDetailView.as_view(), name="salle.supprimer.liste"),
    path("rang/date/", SalleStatView.as_view(), name="salle.rang.date"),
    path("liste/verifier/", SalleEdtView.as_view()),
    path("niveau-parcours/<int:numNiveauParcours>", SalleNiveauParcoursView.as_view()),
    path("occupe-semaine/", SalleOccupeParSemaineView.as_view()),
]
