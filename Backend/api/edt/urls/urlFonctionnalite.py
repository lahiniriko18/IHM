from django.urls import path
from ..views.viewsFonctionnalite import EmailView

urlpatterns = [
    path("email/libre/", EmailView.as_view(), name="fonctionnalite.mailGeneral"),
]
