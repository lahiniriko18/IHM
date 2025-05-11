from django.urls import path
from ..views.viewsFonctionnalite import MdpOublieView,EmailView,ExcelView

urlpatterns = [
    path('email/libre/', EmailView.as_view(), name='fonctionnalite.mailGeneral'),
    path('email/mdpOublie/', MdpOublieView.as_view(), name='fonctionnalite.mailMdpOublie'),
    path('excel/televerser/',ExcelView.as_view(), name='excel.televerser'),
    path('excel/telecharger/',ExcelView.as_view(), name='excel.telecharger'),
]  