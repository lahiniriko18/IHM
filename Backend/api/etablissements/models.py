from django.db import models


class Etablissement(models.Model):
    numEtablissement = models.AutoField(primary_key=True)
    nomEtablissement = models.CharField(max_length=50)
    adresse = models.CharField(max_length=50, null=True)
    email = models.EmailField(max_length=50)
    slogant = models.CharField(max_length=255, null=True)
    logo = models.ImageField(upload_to="images/logo/", null=True, blank=True)
    contact = models.CharField(max_length=17)
    maxUtilisateur = models.IntegerField(default=3, null=True, blank=True)

    class Meta:
        db_table = "etablissement"

    def __str__(self):
        return self.nomEtablissement


class Mention(models.Model):
    numMention = models.AutoField(primary_key=True)
    numEtablissement = models.ForeignKey(
        Etablissement,
        related_name="mentions",
        on_delete=models.CASCADE,
        db_column="numEtablissement",
    )
    nomMention = models.CharField(max_length=50)
    codeMention = models.CharField(max_length=20, null=True)

    class Meta:
        db_table = "mention"

    def __str__(self):
        return self.nomMention


class Parcours(models.Model):
    numParcours = models.AutoField(primary_key=True)
    numMention = models.ForeignKey(
        Mention,
        related_name="parcours",
        on_delete=models.CASCADE,
        db_column="numMention",
    )
    nomParcours = models.CharField(max_length=50)
    codeParcours = models.CharField(max_length=6, null=True)

    class Meta:
        db_table = "parcours"

    def __str__(self):
        return self.nomParcours


class Classe(models.Model):
    numClasse = models.AutoField(primary_key=True)
    niveau = models.CharField(max_length=5)
    groupe = models.CharField(max_length=20, null=True)

    class Meta:
        db_table = "classe"

    def __str__(self):
        return self.niveau


class Salle(models.Model):
    numSalle = models.AutoField(primary_key=True)
    nomSalle = models.CharField(max_length=30)
    lieuSalle = models.CharField(max_length=30, null=True)
    statut = models.BooleanField(default=True)

    class Meta:
        db_table = "salle"

    def __str__(self):
        return self.nomSalle


class NiveauParcours(models.Model):
    numNiveauParcours = models.AutoField(primary_key=True)
    niveau = models.CharField(max_length=10)
    numParcours = models.ForeignKey(
        Parcours,
        related_name="niveauParcours",
        on_delete=models.CASCADE,
        db_column="numParcours",
    )

    class Meta:
        db_table = "niveauparcours"

    def __str__(self):
        return f" {self.niveau} de {self.numNiveauParcours}"


class Constituer(models.Model):
    numConstituer = models.AutoField(primary_key=True)
    numParcours = models.ForeignKey(
        Parcours,
        related_name="constituers",
        on_delete=models.CASCADE,
        db_column="numParcours",
    )
    numClasse = models.ForeignKey(
        Classe,
        related_name="constituers",
        on_delete=models.CASCADE,
        db_column="numClasse",
    )

    class Meta:
        db_table = "constituer"

    def __str__(self):
        return f"{self.numConstituer} dans une classe {self.numClasse}"


class Posseder(models.Model):
    numPosseder = models.AutoField(primary_key=True)
    numNiveauParcours = models.ForeignKey(
        NiveauParcours,
        related_name="posseders",
        on_delete=models.CASCADE,
        db_column="numNiveauParcours",
    )
    numMatiere = models.ForeignKey(
        "professeurs.Matiere",
        related_name="posseders",
        on_delete=models.CASCADE,
        db_column="numMatiere",
    )

    class Meta:
        db_table = "posseder"

    def __str__(self):
        return f"{self.numMatiere} de {self.numNiveauParcours}"
