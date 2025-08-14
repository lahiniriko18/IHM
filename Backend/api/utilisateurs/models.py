from django.contrib.auth.models import AbstractUser
from django.db import models


class Utilisateur(AbstractUser):
    numEtablissement = models.ForeignKey(
        "etablissements.Etablissement",
        related_name="utilisateurs",
        on_delete=models.CASCADE,
        db_column="numEtablissement",
        null=True,
    )
    contact = models.CharField(max_length=17)
    adresse = models.CharField(max_length=100, null=True, blank=True)
    image = models.ImageField(upload_to="images/users/", null=True, blank=True)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    def clean(self):
        return super().clean()

    class Meta:
        db_table = "utilisateur"

    def __str__(self):
        return self.username
