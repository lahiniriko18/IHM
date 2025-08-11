from django.urls import path, include
from .urls import (
    urlClasse,
    urlConstituer,
    urlEtablissement,
    urlMention,
    urlNiveauParcours,
    urlParcours,
    urlPosseder,
    urlSalle,
)

urlpatterns = [
    path("etablissement/", include(urlEtablissement)),
    path("mention/", include(urlMention)),
    path("parcours/", include(urlParcours)),
    path("classe/", include(urlClasse)),
    path("salle/", include(urlSalle)),
    path("constituer/", include(urlConstituer)),
    path("niveau-parcours/", include(urlNiveauParcours)),
    path("posseder/", include(urlPosseder)),
]
