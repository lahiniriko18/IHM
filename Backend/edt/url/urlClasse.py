from django.urls import path
from ..views.viewsClasse import ClasseView,ClasseListView

urlpatterns = [
    path('', ClasseView.as_view(), name="classe"),
    path('ajouter/', ClasseView.as_view(), name="classe.ajouter"),
    path('modifier/<int:numClasse>', ClasseView.as_view(), name="classe.modifier"),
    path('supprimer/<int:numClasse>', ClasseView.as_view(), name="classe.supprimer"),
    path('liste/niveau/', ClasseListView.as_view(), name="classe.niveau"),
    path('liste/<int:numClasse>', ClasseListView.as_view(), name="classe.uneClasse")
]