from django.db import models


class Professeur(models.Model):
    numProfesseur = models.AutoField(primary_key=True)
    numEtablissement = models.ForeignKey(
        "etablissements.Etablissement",
        related_name="professeurs",
        on_delete=models.CASCADE,
        db_column="numEtablissement",
    )
    nomProfesseur = models.CharField(max_length=50)
    prenomProfesseur = models.CharField(max_length=50, null=True)
    nomCourant = models.CharField(max_length=50, null=True)
    grade = models.CharField(max_length=50, null=True)
    sexe = models.CharField(max_length=8)
    adresse = models.CharField(max_length=50, null=True)
    contact = models.CharField(max_length=17, null=True)
    email = models.EmailField(max_length=50, null=True)
    photos = models.ImageField(upload_to="images/professeurs/", null=True, blank=True)

    class Meta:
        db_table = "professeur"

    def __str__(self):
        return self.nomProfesseur


class Matiere(models.Model):
    numMatiere = models.AutoField(primary_key=True)
    nomMatiere = models.CharField(max_length=50)
    codeMatiere = models.CharField(max_length=20, null=True)

    class Meta:
        db_table = "matiere"

    def __str__(self):
        return self.nomMatiere


class Enseigner(models.Model):
    numEnseigner = models.AutoField(primary_key=True)
    numProfesseur = models.ForeignKey(
        Professeur,
        related_name="enseigners",
        on_delete=models.CASCADE,
        db_column="numProfesseur",
    )
    numMatiere = models.ForeignKey(
        Matiere,
        related_name="enseigners",
        on_delete=models.CASCADE,
        db_column="numMatiere",
    )

    class Meta:
        db_table = "enseigner"

    def __str__(self):
        return f"{self.numEnseigner} par {self.numProfesseur}"
