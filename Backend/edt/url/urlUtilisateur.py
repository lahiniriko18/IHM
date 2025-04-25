from django.urls import path
from ..views.viewsUtilisateur import InscriptionView,ConnexionView,DeconnexionView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('inscription/', InscriptionView.as_view(), name='inscription'),
    path('connexion/', ConnexionView.as_view(), name='connexion'),
    path('deconnexion/',DeconnexionView.as_view() , name='deconnexion'),
    path('token/', obtain_auth_token, name='api_token_auth'),
]   