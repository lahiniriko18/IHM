from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from ..views.viewsEtablissement import EtablissementView

urlpatterns = [
    path("", EtablissementView.as_view(), name="etablissement"),
    path("ajouter/", EtablissementView.as_view(), name="etablissement.ajouter"),
    path(
        "modifier/<int:numEtablissement>",
        EtablissementView.as_view(),
        name="etablissement.modifier",
    ),
    path(
        "supprimer/<int:numEtablissement>",
        EtablissementView.as_view(),
        name="etablissement.supprimer",
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
