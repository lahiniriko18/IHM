from django.urls import path
from ..views.viewsGroupe import GroupeView

urlpatterns = [
    path('', GroupeView.as_view(), name="groupe"),
    path('ajouter/', GroupeView.as_view(), name="groupe.ajouter"),
    path('modifier/<int:numGroupe>', GroupeView.as_view(), name="groupe.modifier"),
    path('supprimer/<int:numGroupe>', GroupeView.as_view(), name="groupe.supprimer")
]