from django.urls import path
from ..views import viewsParcours

urlpatterns = [
    path('',viewsParcours.listParcours, name="parcours"),
    path('ajouter/',viewsParcours.ajoutParcours, name="parcours.ajouter"),
    path('modifier/<int:numParcours>',viewsParcours.modifParcours, name="parcours.modifier"),
    path('supprimer/<int:numParcours>',viewsParcours.supprimeParcours, name="parcours.supprimer")
]