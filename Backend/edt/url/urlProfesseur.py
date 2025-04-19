from django.urls import path
from ..views import viewsProfesseur

urlpatterns = [
    path('',viewsProfesseur.listProfesseur, name="professeur"),
    path('ajouter/',viewsProfesseur.ajoutProfesseur, name="professeur.ajouter"),
    path('modifier/<int:numProfesseur>',viewsProfesseur.modifProfesseur, name="professeur.modifier"),
    path('supprimer/<int:numProfesseur>',viewsProfesseur.supprimeProfesseur, name="professeur.supprimer")
]