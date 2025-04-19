from django.urls import path
from ..views import viewsEdt

urlpatterns = [
    path('',viewsEdt.listEdt, name="edt"),
    path('ajouter/',viewsEdt.ajoutEdt, name="edt.ajouter"),
    path('modifier/<int:numEdt>',viewsEdt.modifEdt, name="edt.modifier"),
    path('supprimer/<int:numEdt>',viewsEdt.supprimeEdt, name="edt.supprimer")
]