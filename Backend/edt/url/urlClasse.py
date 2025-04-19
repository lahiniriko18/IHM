from django.urls import path
from ..views import viewsClasse

urlpatterns = [
    path('',viewsClasse.listClasse, name="classe"),
    path('ajouter/',viewsClasse.ajoutClasse, name="classe.ajouter"),
    path('modifier/<int:numClasse>',viewsClasse.modifClasse, name="classe.modifier"),
    path('supprimer/<int:numClasse>',viewsClasse.supprimeClasse, name="classe.supprimer")
]