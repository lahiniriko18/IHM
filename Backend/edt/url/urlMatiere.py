from django.urls import path
from ..views.viewsMatiere import MatiereView

urlpatterns = [
    path('', MatiereView.as_view(), name="matiere"),
    path('ajouter/', MatiereView.as_view(), name="matiere.ajouter"),
    path('modifier/<int:numMatiere>', MatiereView.as_view(), name="matiere.modifier"),
    path('supprimer/<int:numMatiere>', MatiereView.as_view(), name="matiere.supprimer")
]