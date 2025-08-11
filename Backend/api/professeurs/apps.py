from django.apps import AppConfig


class ProfesseursConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api.professeurs"
    label = "professeurs"

    def ready(self):
        import api.professeurs.signals
