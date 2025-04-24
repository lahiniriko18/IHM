from django.urls import path
from ..views.viewsSalle import SalleView

urlpatterns = [
    path('', SalleView.as_view(), name="salle"),
    path('ajouter/', SalleView.as_view(), name="salle.ajouter"),
    path('modifier/<int:numSalle>', SalleView.as_view(), name="salle.modifier"),
    path('supprimer/<int:numSalle>', SalleView.as_view(), name="salle.supprimer")
]