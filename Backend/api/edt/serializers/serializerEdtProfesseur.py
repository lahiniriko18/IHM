import locale
from datetime import date, datetime, timedelta

from rest_framework import serializers


class EdtProfesseurSerializer(serializers.Serializer):
    nomProfesseur = serializers.CharField()
    dateDebut = serializers.CharField()
    dateFin = serializers.CharField()

    def validate(self, data):
        donnees = {}
        donnees["titre1"] = f"Emploi du temps pour {data.get('nomProfesseur')}"

        locale.setlocale(locale.LC_TIME, "fr_FR.UTF-8")
        dateDonnee = date.today()
        dateDonnee = dateDonnee + timedelta(days=7)
        if data.get("dateDebut") and data.get("dateFin"):
            dateDonnee = data.get("dateDebut")
            if isinstance(data.get("dateDebut"), str):
                try:
                    dateDonnee = datetime.strptime(data.get("dateDebut"), "%d-%m-%Y")
                except ValueError:
                    raise serializers.ValidationError(
                        {"erreur": "Format de date invalide !"}
                    )
        lundi = dateDonnee - timedelta(days=dateDonnee.weekday())
        samedi = lundi + timedelta(days=5)

        jourDebut = lundi.day
        moisDebut = lundi.strftime("%B").capitalize()
        jourFin = samedi.day
        moisFin = samedi.strftime("%B").capitalize()
        anneeDebut = lundi.year
        anneeFin = samedi.year

        semaine = [
            datetime.strftime(lundi + timedelta(days=i), "%d-%m-%Y") for i in range(6)
        ]
        print(semaine)
        donnees["semaine"] = semaine

        if anneeDebut != anneeFin:
            donnees["titre2"] = (
                f"{jourDebut:02d} {moisDebut} {anneeDebut} au {jourFin:02d} {moisFin} {anneeFin}"
            )
        elif moisDebut != moisFin:
            donnees["titre2"] = (
                f"{jourDebut:02d} {moisDebut} au {jourFin:02d} {moisFin} {anneeFin}"
            )
        else:
            donnees["titre2"] = f"{jourDebut:02d} au {jourFin:02d} {moisFin} {anneeFin}"
        return donnees
