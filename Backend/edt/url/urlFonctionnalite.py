from django.urls import path
from ..views.viewsFonctionnalite import EffectifView,EmailView

urlpatterns = [
    path('email/libre/', EmailView.as_view(), name='fonctionnalite.mailGeneral'),
   # path('email/mdpOublie/', MdpOublieView.as_view(), name='fonctionnalite.mailMdpOublie'),
    path('effectif/', EffectifView.as_view(), name='fonctionnalite.effectif')
]