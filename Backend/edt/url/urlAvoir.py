from django.urls import path
from ..views.viewsAvoir import AvoirView

urlpatterns = [
    path('', AvoirView.as_view(), name="avoir"),
    path('ajouter/', AvoirView.as_view(), name="avoir.ajouter"),
    path('modifier/<int:numAvoir>', AvoirView.as_view(), name="avoir.modifier"),
    path('supprimer/<int:numAvoir>', AvoirView.as_view(), name="avoir.supprimer")
]