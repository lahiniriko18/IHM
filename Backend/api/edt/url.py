from django.urls import path, include
from .urls import (
    urlStatistique,
    urlAction,
    urlAvoir,
    urlEdt,
    urlFonctionnalite,
)

urlpatterns = [
    path("edt/", include(urlEdt)),
    path("avoir/", include(urlAvoir)),
    path("fonctionnalite/", include(urlFonctionnalite)),
    path("statistique/", include(urlStatistique)),
    path("action/", include(urlAction)),
]
