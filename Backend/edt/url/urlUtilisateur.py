from django.urls import path
from ..views.viewsUtilisateur import InscriptionView,ConnexionView,DeconnexionView

urlpatterns = [
    path('inscription/', InscriptionView.as_view(), name='inscription'),
    path('connexion/', ConnexionView.as_view(), name='connexion'),
    path('deconnexion/',DeconnexionView.as_view() , name='deconnexion'),
]