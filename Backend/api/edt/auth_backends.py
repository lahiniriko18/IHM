from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

Utilisateur=get_user_model()

class EmailOrUsernameBackend(ModelBackend):
    def authenticate(self, request, username = None, password = None, **kwargs):
        try:
            utilisateur=Utilisateur.objects.get(email=username)
        except Utilisateur.DoesNotExist:
            try:
                utilisateur=Utilisateur.objects.get(username=username)
            except Utilisateur.DoesNotExist:
                return None
        if utilisateur.check_password(password) and self.user_can_authenticate(utilisateur):
            return utilisateur
        return None