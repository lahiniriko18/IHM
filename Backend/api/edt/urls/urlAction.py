from django.urls import path
from ..views.viewsAction import ActionView

urlpatterns = [
    path("", ActionView.as_view(), name="action"),
    path("ajouter/", ActionView.as_view(), name="action.ajouter"),
    path("modifier/<int:numAction>", ActionView.as_view(), name="action.modifier"),
    path("supprimer/<int:numAction>", ActionView.as_view(), name="action.supprimer"),
]
