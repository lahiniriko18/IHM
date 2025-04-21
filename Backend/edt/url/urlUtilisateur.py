from django.urls import path
from ..views.viewsUtilisateur import InscriptionView

urlpatterns = [
    path('inscription/', InscriptionView.as_view(), name='inscription')
]