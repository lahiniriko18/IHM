from django.urls import path
from ..views.viewsProfesseur import ProfesseurView,ProfesseurDetailView

urlpatterns = [
    path('',ProfesseurView.as_view(), name="professeur"),
    path('ajouter/',ProfesseurView.as_view(), name="professeur.ajouter"),
    path('modifier/<int:numProfesseur>',ProfesseurView.as_view(), name="professeur.modifier"),
    path('supprimer/<int:numProfesseur>',ProfesseurView.as_view(), name="professeur.supprimer"),
    path('detail/<int:numProfesseur>',ProfesseurDetailView.as_view(), name="professeur.detail"),
]