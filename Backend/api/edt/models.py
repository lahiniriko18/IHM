from django.db import models


class Edt(models.Model):
    numEdt = models.AutoField(primary_key=True)
    numMatiere = models.ForeignKey(
        "professeurs.Matiere",
        related_name="edts",
        on_delete=models.CASCADE,
        db_column="numMatiere",
    )
    numProfesseur = models.ForeignKey(
        "professeurs.Professeur",
        related_name="edts",
        on_delete=models.CASCADE,
        db_column="numProfesseur",
        null=True,
    )
    numParcours = models.ForeignKey(
        "etablissements.Parcours",
        related_name="edts",
        on_delete=models.CASCADE,
        null=True,
        db_column="numParcours",
    )
    numSalle = models.ForeignKey(
        "etablissements.Salle",
        related_name="edts",
        on_delete=models.CASCADE,
        null=True,
        db_column="numSalle",
    )
    numClasse = models.ForeignKey(
        "etablissements.Classe",
        related_name="edts",
        on_delete=models.CASCADE,
        null=True,
        db_column="numClasse",
    )
    date = models.DateField()
    heureDebut = models.TimeField()
    heureFin = models.TimeField()

    class Meta:
        db_table = "edt"

    def __str__(self):
        return f"{self.heureDebut} à {self.heureFin}"


class Avoir(models.Model):
    numAvoir = models.AutoField(primary_key=True)
    numEdt = models.ForeignKey(Edt, on_delete=models.CASCADE, db_column="numEdt")
    numEtablissement = models.ForeignKey(
        "etablissements.Etablissement",
        related_name="avoirs",
        on_delete=models.CASCADE,
        db_column="numEtablissement",
    )

    class Meta:
        db_table = "avoir"

    def __str__(self):
        return f"{self.numAvoir} pour {self.numEdt}"


class Action(models.Model):
    numAction = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(
        "utilisateurs.Utilisateur",
        related_name="actions",
        null=True,
        on_delete=models.SET_NULL,
        db_column="user_id",
    )
    type = models.CharField(max_length=20)
    text = models.CharField(max_length=100, null=True)
    table = models.CharField(max_length=20, null=True)
    statut = models.BooleanField(default=False)

    class Meta:
        db_table = "action"

    def __str__(self):
        return self.text
