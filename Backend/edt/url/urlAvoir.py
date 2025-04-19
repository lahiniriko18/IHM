from django.urls import path
from ..views import viewsAvoir

urlpatterns = [
    path('',viewsAvoir.listAvoir, name="avoir"),
    path('ajouter/',viewsAvoir.ajoutAvoir, name="avoir.ajouter"),
    path('modifier/<int:numAvoir>',viewsAvoir.modifAvoir, name="avoir.modifier"),
    path('supprimer/<int:numAvoir>',viewsAvoir.supprimeAvoir, name="avoir.supprimer")
]