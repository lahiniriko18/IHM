from django.urls import path
from ..views.edts.viewsEdt import EdtView,ListeEdtView
from ..views.edts.viewsEdtExcel import EdtExcelView
from ..views.edts.viewsModele import ModeleExcelView
from ..views.edts.viewsEdtDetail import EdtDetailView

urlpatterns = [
    path('', EdtView.as_view(), name="edt"),
    path('ajouter/', EdtView.as_view(), name="edt.ajouter"),
    path('ajouter/excel/', EdtExcelView.as_view(), name="edt.ajouter.excel"),
    path('modifier/<int:numEdt>', EdtView.as_view(), name="edt.modifier"),
    path('supprimer/<int:numEdt>', EdtView.as_view(), name="edt.supprimer"),
    path('supprimer/liste/', ListeEdtView.as_view(), name='edt.supprimer.liste'),
    path('telecharger/',ModeleExcelView.as_view(),name='edt.telecharger'),
    path('ajouter/liste/', ListeEdtView.as_view(), name='edt.ajouter.liste'),
    path('modifier/liste/', ListeEdtView.as_view(), name='edt.modifier.liste'),
    path('modifier/donnee/', EdtDetailView.as_view(), name='edt.modifier.donnee'),
    path('dernier/', EdtDetailView.as_view(), name='edt.dernier')
]