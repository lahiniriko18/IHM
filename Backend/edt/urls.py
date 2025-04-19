from django.urls import path,include
from .url import urlEnseigner,urlAvoir,urlConstituer,urlProfesseur,urlEtablissement,urlMention,urlParcours,urlMatiere,urlClasse,urlSalle,urlEdt,urlFonctionnalite

urlpatterns = [
    path('professeur/', include(urlProfesseur)),
    path('etablissement/', include(urlEtablissement)),
    path('mention/', include(urlMention)),
    path('parcours/', include(urlParcours)),
    path('matiere/', include(urlMatiere)),
    path('classe/', include(urlClasse)),
    path('salle/', include(urlSalle)),
    path('edt/', include(urlEdt)),
    path('constituer/', include(urlConstituer)),
    path('avoir/', include(urlAvoir)),
    path('enseigner/', include(urlEnseigner)),
    path('fonctionnalite/', include(urlFonctionnalite))
]