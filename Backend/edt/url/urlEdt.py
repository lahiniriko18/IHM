from django.urls import path
from ..views.viewsEdt import EdtView,EdtExcelView

urlpatterns = [
    path('', EdtView.as_view(), name="edt"),
    path('ajouter/', EdtView.as_view(), name="edt.ajouter"),
    path('ajouter/excel/', EdtExcelView.as_view(), name="edt.ajouter.excel"),
    path('modifier/<int:numEdt>', EdtView.as_view(), name="edt.modifier"),
    path('supprimer/<int:numEdt>', EdtView.as_view(), name="edt.supprimer")
]