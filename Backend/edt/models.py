from django.contrib.auth.models import AbstractUser
from django.db import models

class Etablissement(models.Model):
    numEtablissement=models.AutoField(primary_key=True)
    nomEtablissement=models.CharField(max_length=50)
    adresse=models.CharField(max_length=50, null=True)
    email=models.EmailField(max_length=50)
    slogant=models.CharField(max_length=255, null=True)
    logo=models.CharField(max_length=100, null=True)
    contact=models.CharField(max_length=17)

    class Meta:
        db_table='etablissement'
    def __str__(self):
        return self.nom


class Professeur(models.Model):
    numProfesseur=models.AutoField(primary_key=True)
    numEtablissement=models.ForeignKey(Etablissement, on_delete=models.CASCADE, db_column='numEtablissement')
    nomProfesseur=models.CharField(max_length=50)
    prenomProfesseur=models.CharField(max_length=50, null=True)
    grade=models.CharField(max_length=50, null=True)
    sexe=models.CharField(max_length=1)
    adresse=models.CharField(max_length=50, null=True)
    contact=models.CharField(max_length=17, null=True)
    email=models.EmailField(max_length=50, null=True)
    description=models.CharField(max_length=255, null=True)

    class Meta:
        db_table='professeur'
    def __str__(self):
        return self.nomProfesseur
    

class Mention(models.Model):
    numMention=models.AutoField(primary_key=True)
    numEtablissement=models.ForeignKey(Etablissement, on_delete=models.CASCADE, db_column='numEtablissement')
    nomMention=models.CharField(max_length=50)

    class Meta:
        db_table='mention'
    def __str__(self):
        return self.nomMention
    

class Parcours(models.Model):
    numParcours=models.AutoField(primary_key=True)
    numMention=models.ForeignKey(Mention, on_delete=models.CASCADE, db_column='numMention')
    nomParcours=models.CharField(max_length=50)

    class Meta:
        db_table='parcours'
    def __str__(self):
        return self.nomParcours
    

class Matiere(models.Model):
    numMatiere=models.AutoField(primary_key=True)
    nomMatiere=models.CharField(max_length=50)

    class Meta:
        db_table='matiere'
    def __str__(self):
        return self.nomMatiere

class Classe(models.Model):
    numClasse=models.AutoField(primary_key=True)
    niveau=models.CharField(max_length=5)
    groupe=models.CharField(max_length=10, null=True)

    class Meta:
        db_table='classe'
    def __str__(self):
        return self.niveau
      

class Salle(models.Model):
    numSalle=models.AutoField(primary_key=True)
    nomSalle=models.CharField(max_length=30)

    class Meta:
        db_table='salle'
    def __str__(self):
        return self.nomSalle
    

class Edt(models.Model):
    numEdt=models.AutoField(primary_key=True)
    numMatiere=models.ForeignKey(Matiere, on_delete=models.CASCADE, db_column='numMatiere')
    numParcours=models.ForeignKey(Parcours, on_delete=models.SET_NULL, null=True, db_column='numParcours')
    numSalle=models.ForeignKey(Salle, on_delete=models.SET_NULL, null=True, db_column='numSalle')
    numClasse=models.ForeignKey(Classe, on_delete=models.SET_NULL, null=True, db_column='numClasse')
    date=models.DateField()
    heureDebut=models.TimeField()
    heureFin=models.TimeField()

    class Meta:
        db_table='edt'
    def __str__(self):
        return f"{self.heureDebut} à {self.heureFin}"
    

class Constituer(models.Model):
    numConstituer=models.AutoField(primary_key=True)
    numParcours=models.ForeignKey(Parcours, on_delete=models.CASCADE, db_column='numParcours')
    numClasse=models.ForeignKey(Classe, on_delete=models.CASCADE, db_column='numClasse')

    class Meta:
        db_table='constituer'
    def __str__(self):
        return f"{self.numConstituer} dans une classe {self.numClasse}"


class Avoir(models.Model):
    numAvoir=models.AutoField(primary_key=True)
    numEdt=models.ForeignKey(Edt, on_delete=models.CASCADE, db_column='numEdt')
    numEtablissement=models.ForeignKey(Etablissement, on_delete=models.CASCADE, db_column='numEtablissement')

    class Meta:
        db_table='avoir'
    def __str__(self):
        return f"{self.numAvoir} pour {self.numEdt}"
    

class Enseigner(models.Model):
    numEnseigner=models.AutoField(primary_key=True)
    numProfesseur=models.ForeignKey(Professeur, on_delete=models.CASCADE, db_column='numProfesseur')
    numMatiere=models.ForeignKey(Matiere, on_delete=models.CASCADE, db_column='numMatiere')

    class Meta:
        db_table='enseigner'
    def __str__(self):
        return f"{self.numEnseigner} par {self.numProfesseur}"
    

class Utilisateur(AbstractUser):
    contact=models.CharField(max_length=17)
    datenaiss=models.DateField(null=True)
    description=models.TextField(null=True)
    image=models.CharField(max_length=255, null=True)

    is_superuser=models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    class Meta:
        db_table='utilisateur'
    def __str__(self):
        return self.username


class Action(models.Model):
    numAction=models.AutoField(primary_key=True)
    user_id=models.ForeignKey(Utilisateur, null=True, on_delete=models.SET_NULL, db_column='user_id')
    type=models.CharField(max_length=20)
    text=models.CharField(max_length=100, null=True)
    table=models.CharField(max_length=20, null=True)
    statut=models.BooleanField(default=False)

    class Meta:
        db_table='action'
    def __str__(self):
        return self.description
    