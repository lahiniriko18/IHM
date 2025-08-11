from django.apps import AppConfig


class EtablissementsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api.etablissements"
    label = "etablissements"

    def ready(self):
        import api.etablissements.signals
