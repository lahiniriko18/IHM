from django.urls import path

from ..views.viewsStatistique import EffectifView

urlpatterns = [path("effectif/", EffectifView.as_view(), name="statistique.effectif")]
