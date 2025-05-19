from django.urls import path
from ..views.professeur.viewsProfesseur import ProfesseurView
from ..views.professeur.viewsProfesseurDetail import ProfesseurDetailView,ProfesseurNiveauParcoursView
from ..views.professeur.viewsProfesseurEffectif import ProfesseurEffectifView

urlpatterns = [
    path('',ProfesseurView.as_view(), name="professeur"),
    path('ajouter/',ProfesseurView.as_view(), name="professeur.ajouter"),
    path('modifier/<int:numProfesseur>',ProfesseurView.as_view(), name="professeur.modifier"),
    path('supprimer/<int:numProfesseur>',ProfesseurView.as_view(), name="professeur.supprimer"),
    path('detail/<int:numProfesseur>',ProfesseurDetailView.as_view(), name="professeur.detail"),
    path('niveau-parcours/<int:numNiveauParcours>',ProfesseurNiveauParcoursView.as_view(), name="professeur.niveauParcours"),
    path('horaire/',ProfesseurEffectifView.as_view(), name="professeur.horaire.deuxDates"),
]