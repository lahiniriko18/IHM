from django.urls import path

from ..views.viewsParcours import ParcourDetailView, ParcoursView

urlpatterns = [
    path("", ParcoursView.as_view(), name="parcours"),
    path("ajouter/", ParcoursView.as_view(), name="parcours.ajouter"),
    path(
        "modifier/<int:numParcours>", ParcoursView.as_view(), name="parcours.modifier"
    ),
    path(
        "supprimer/<int:numParcours>", ParcoursView.as_view(), name="parcours.supprimer"
    ),
    path(
        "supprimer/liste/", ParcourDetailView.as_view(), name="parcours.supprimer.liste"
    ),
]
