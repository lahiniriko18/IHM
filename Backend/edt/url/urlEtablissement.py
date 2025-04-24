from django.urls import path
from ..views.viewsEtablissement import EtablissementView

urlpatterns = [
    path('',EtablissementView.as_view(), name="etablissement"),
    path('ajouter/',EtablissementView.as_view(), name="etablissement.ajouter"),
    path('modifier/<int:numEtablissement>',EtablissementView.as_view(), name="etablissement.modifier"),
    path('supprimer/<int:numEtablissement>',EtablissementView.as_view(), name="etablissement.supprimer")
]