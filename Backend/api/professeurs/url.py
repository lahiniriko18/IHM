from django.urls import path, include
from .urls import urlProfesseur, urlMatiere, urlEnseigner

urlpatterns = [
    path("professeur/", include(urlProfesseur)),
    path("matiere/", include(urlMatiere)),
    path("enseigner/", include(urlEnseigner)),
]
