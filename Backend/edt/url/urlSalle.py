from django.urls import path
from ..views import viewsSalle

urlpatterns = [
    path('',viewsSalle.listSalle, name="salle"),
    path('ajouter/',viewsSalle.ajoutSalle, name="salle.ajouter"),
    path('modifier/<int:numSalle>',viewsSalle.modifSalle, name="salle.modifier"),
    path('supprimer/<int:numSalle>',viewsSalle.supprimeSalle, name="salle.supprimer")
]