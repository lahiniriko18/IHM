from django.urls import path

from ..views.viewsEnseigner import EnseignerView

urlpatterns = [
    path("", EnseignerView.as_view(), name="enseigner"),
    path("ajouter/", EnseignerView.as_view(), name="enseigner.ajouter"),
    path(
        "modifier/<int:numEnseigner>",
        EnseignerView.as_view(),
        name="enseigner.modifier",
    ),
    path(
        "supprimer/<int:numEnseigner>",
        EnseignerView.as_view(),
        name="enseigner.supprimer",
    ),
]
