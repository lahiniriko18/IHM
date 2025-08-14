from django.urls import include, path

from .urls import urlEnseigner, urlMatiere, urlProfesseur

urlpatterns = [
    path("professeur/", include(urlProfesseur)),
    path("matiere/", include(urlMatiere)),
    path("enseigner/", include(urlEnseigner)),
]
