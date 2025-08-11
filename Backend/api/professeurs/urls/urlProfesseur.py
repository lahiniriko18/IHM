from django.urls import path
from ..views.professeurs.viewsProfesseur import ProfesseurView
from ..views.professeurs.viewsProfesseurDetail import (
    ProfesseurDetailView,
    ProfesseurNiveauParcoursView,
)
from ..views.professeurs.viewsProfesseurStat import ProfesseurStatView

urlpatterns = [
    path("", ProfesseurView.as_view(), name="professeur"),
    path("ajouter/", ProfesseurView.as_view(), name="professeur.ajouter"),
    path(
        "modifier/<int:numProfesseur>",
        ProfesseurView.as_view(),
        name="professeur.modifier",
    ),
    path(
        "supprimer/<int:numProfesseur>",
        ProfesseurView.as_view(),
        name="professeur.supprimer",
    ),
    path(
        "supprimer/liste/",
        ProfesseurDetailView.as_view(),
        name="professeur.supprimer.liste",
    ),
    path(
        "detail/<int:numProfesseur>",
        ProfesseurDetailView.as_view(),
        name="professeur.detail",
    ),
    path(
        "niveau-parcours/<int:numNiveauParcours>",
        ProfesseurNiveauParcoursView.as_view(),
        name="professeur.niveauParcours",
    ),
    path("horaire/", ProfesseurStatView.as_view()),
    path("semaine/", ProfesseurStatView.as_view()),
]
