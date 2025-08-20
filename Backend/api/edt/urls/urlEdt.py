from django.urls import path

from ..views.edts.viewsEdt import EdtTableauView, EdtView, ListeEdtView
from ..views.edts.viewsEdtDetail import (
    EdtDetailView,
    EdtProfesseurView,
    EdtVerificationView,
)
from ..views.edts.viewsEdtExcel import EdtExcelView
from ..views.edts.viewsEdtStat import (
    EdtNiveauSemaineView,
    EdtSemaineView,
    EdtProfesseurSemaineView,
    EdtEffectifMensuelleView,
)
from ..views.edts.viewsModele import ModeleExcelView

urlpatterns = [
    path("", EdtView.as_view()),
    path("ajouter/", EdtView.as_view()),
    path("ajouter/excel/", EdtExcelView.as_view()),
    path("ajouter/verifier/", EdtVerificationView.as_view()),
    path("modifier/<int:numEdt>", EdtView.as_view()),
    path("supprimer/<int:numEdt>", EdtView.as_view()),
    path("supprimer/liste/", EdtTableauView.as_view()),
    path("telecharger/", ModeleExcelView.as_view()),
    path("ajouter/liste/", ListeEdtView.as_view()),
    path("modifier/liste/", ListeEdtView.as_view()),
    path("modifier/donnee/", EdtDetailView.as_view()),
    path("dernier/", EdtDetailView.as_view()),
    path("mail/distribuer/", EdtProfesseurView.as_view()),
    path("semaine/", EdtSemaineView.as_view()),
    path("niveau-semaine/", EdtNiveauSemaineView.as_view()),
    path("professeur-semaine/", EdtProfesseurSemaineView.as_view()),
    path("effectif-mensuelle/", EdtEffectifMensuelleView.as_view()),
]
