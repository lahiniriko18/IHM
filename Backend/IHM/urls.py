from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.edt.url")),
    path("api/", include("api.etablissements.url")),
    path("api/", include("api.professeurs.url")),
    path("api/user/", include("api.utilisateurs.urls")),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
