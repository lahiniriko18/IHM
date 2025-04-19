from django.urls import path
from ..views import viewsEtablissement as vet

urlpatterns = [
    path('',vet.listEtablissement, name="etablissement"),
    path('ajouter/',vet.ajoutEtablissement, name="etablissement.ajouter"),
    path('modifier/<int:numEtablissement>',vet.modifEtablissement, name="etablissement.modifier"),
    path('supprimer/<int:numEtablissement>',vet.supprimeEtablissement, name="etablissement.supprimer")
]