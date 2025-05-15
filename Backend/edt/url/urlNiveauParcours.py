from django.urls import path
from ..views.viewsNiveauParcours import NiveauParcoursView

urlpatterns = [
    path('', NiveauParcoursView.as_view(), name="niveauParcours"),
    path('ajouter/', NiveauParcoursView.as_view(), name="niveauParcours.ajouter"),
    path('modifier/<int:numNiveauParcours>', NiveauParcoursView.as_view(), name="niveauParcours.modifier"),
    path('supprimer/<int:numNiveauParcours>', NiveauParcoursView.as_view(), name="niveauParcours.supprimer")
]