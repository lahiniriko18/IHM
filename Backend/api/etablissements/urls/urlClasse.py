from django.urls import path
from ..views.classes.viewsClasse import ClasseView
from ..views.classes.viewsClasseDetail import ClasseDetailView, ClasseNiveauParcoursView

urlpatterns = [
    path("", ClasseView.as_view(), name="classe"),
    path("ajouter/", ClasseView.as_view(), name="classe.ajouter"),
    path("modifier/<int:numClasse>", ClasseView.as_view(), name="classe.modifier"),
    path("supprimer/<int:numClasse>", ClasseView.as_view(), name="classe.supprimer"),
    path("supprimer/liste/", ClasseDetailView.as_view(), name="classe.supprimer.liste"),
    path("liste/<int:numClasse>", ClasseDetailView.as_view(), name="classe.uneClasse"),
    path(
        "niveau-parcours/<int:numNiveauParcours>",
        ClasseNiveauParcoursView.as_view(),
        name="classe.niveauParcours",
    ),
]
