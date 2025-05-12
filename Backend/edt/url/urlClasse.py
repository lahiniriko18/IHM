from django.urls import path
from ..views.viewsClasse import ClasseView,ModifClasseView

urlpatterns = [
    path('', ClasseView.as_view(), name="classe"),
    path('ajouter/', ClasseView.as_view(), name="classe.ajouter"),
    path('modifier/<int:numClasse>', ClasseView.as_view(), name="classe.modifier"),
    path('supprimer/<int:numClasse>', ClasseView.as_view(), name="classe.supprimer"),
    path('modifier/', ModifClasseView.as_view(), name='classe.modifier.page')
]