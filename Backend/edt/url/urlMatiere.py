from django.urls import path
from ..views.viewsMatiere import MatiereView,MatiereDetailView,MatiereNiveauParcoursView

urlpatterns = [
    path('', MatiereView.as_view(), name="matiere"),
    path('<int:numMatiere>', MatiereDetailView.as_view(), name="matiere.uneMatiere"),
    path('ajouter/', MatiereView.as_view(), name="matiere.ajouter"),
    path('modifier/<int:numMatiere>', MatiereView.as_view(), name="matiere.modifier"),
    path('supprimer/<int:numMatiere>', MatiereView.as_view(), name="matiere.supprimer"),
    path('niveau-parcours/<int:numNiveauParcours>', MatiereNiveauParcoursView.as_view(), name="matiere.niveauParcours")
]