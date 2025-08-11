from django.urls import path
from ..views.viewsConstituer import ConstituerView

urlpatterns = [
    path("", ConstituerView.as_view(), name="constituer"),
    path("ajouter/", ConstituerView.as_view(), name="constituer.ajouter"),
    path(
        "modifier/<int:numConstituer>",
        ConstituerView.as_view(),
        name="constituer.modifier",
    ),
    path(
        "supprimer/<int:numConstituer>",
        ConstituerView.as_view(),
        name="constituer.supprimer",
    ),
]
