from django.urls import path
from ..views import viewsFonctionnalite

urlpatterns = [
    path('email/libre/', viewsFonctionnalite.envoyerMailLibre, name='fonctionnalite.mailGeneral'),
    path('email/mdpOublie/', viewsFonctionnalite.envoyerMailMdpOublie, name='fonctionnalite.mailMdpOublie'),
    path('effectif/', viewsFonctionnalite.effectifTable, name='fonctionnalite.effectif')
]