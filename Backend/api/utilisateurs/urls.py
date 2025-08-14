from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views.viewsAuth import *
from .views.viewsEmails import ValidationCodeView
from .views.viewsUtilisateur import *

urlpatterns = [
    path("inscription/", InscriptionView.as_view()),
    path("connexion/", ConnexionView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("deconnexion/", DeconnexionView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("modifier-profile/", ProfileView.as_view()),
    path("reset-password/", ResetPasswordView.as_view()),
    path("change-username/", ChangeUsernameView.as_view()),
    path("verify-password/", VerifyPassword.as_view()),
    path("validation-code/", ValidationCodeView.as_view()),
]
