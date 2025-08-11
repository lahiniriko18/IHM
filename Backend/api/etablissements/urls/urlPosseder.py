from django.urls import path
from ..views.viewsPosseder import PossederView

urlpatterns = [
    path("", PossederView.as_view(), name="posseder"),
    path("ajouter/", PossederView.as_view(), name="posseder.ajouter"),
    path(
        "modifier/<int:numPosseder>", PossederView.as_view(), name="posseder.modifier"
    ),
    path(
        "supprimer/<int:numPosseder>", PossederView.as_view(), name="posseder.supprimer"
    ),
]
