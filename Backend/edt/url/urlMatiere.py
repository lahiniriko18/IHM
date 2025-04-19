from django.urls import path
from ..views import viewsMatiere

urlpatterns = [
    path('',viewsMatiere.listMatiere, name="matiere"),
    path('ajouter/',viewsMatiere.ajoutMatiere, name="matiere.ajouter"),
    path('modifier/<int:numMatiere>',viewsMatiere.modifMatiere, name="matiere.modifier"),
    path('supprimer/<int:numMatiere>',viewsMatiere.supprimeMatiere, name="matiere.supprimer")
]