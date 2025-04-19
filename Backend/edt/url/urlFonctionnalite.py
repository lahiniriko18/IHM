from django.urls import path
from ..views import viewsFonctionnalite

urlpatterns = [
    path('email/', viewsFonctionnalite.envoyerMail, name='fonctionnalite.mail')
]