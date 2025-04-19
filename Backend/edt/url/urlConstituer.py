from django.urls import path
from ..views import viewsConstituer

urlpatterns = [
    path('',viewsConstituer.listConstituer, name="constituer"),
    path('ajouter/',viewsConstituer.ajoutConstituer, name="constituer.ajouter"),
    path('modifier/<int:numConstituer>',viewsConstituer.modifConstituer, name="constituer.modifier"),
    path('supprimer/<int:numConstituer>',viewsConstituer.supprimeConstituer, name="constituer.supprimer")
]