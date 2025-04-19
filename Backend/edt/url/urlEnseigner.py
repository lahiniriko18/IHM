from django.urls import path
from ..views import viewsEnseigner

urlpatterns = [
    path('',viewsEnseigner.listEnseigner, name="enseigner"),
    path('ajouter/',viewsEnseigner.ajoutEnseigner, name="enseigner.ajouter"),
    path('modifier/<int:numEnseigner>',viewsEnseigner.modifEnseigner, name="enseigner.modifier"),
    path('supprimer/<int:numEnseigner>',viewsEnseigner.supprimeEnseigner, name="enseigner.supprimer")
]