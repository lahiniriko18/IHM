from datetime import timedelta, datetime
from rest_framework import status
from api.edt.serializers.serializerEdt import EdtSerializer
from api.etablissements.serializers.serializerNiveauParcours import (
    NiveauParcoursSerializer,
)
from api.edt.models import Edt
from api.etablissements.models import Classe, NiveauParcours
from collections import defaultdict
from datetime import datetime


def listeEdtParNumEdts(numEdts):
    edts = Edt.objects.filter(numEdt__in=numEdts).order_by("heureDebut")
    if edts:
        titre = []
        premierEdt = Edt.objects.filter(numEdt__in=numEdts).first()
        lundi = premierEdt.date - timedelta(days=premierEdt.date.weekday())

        jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
        dates = {}
        for i, jour in enumerate(jours):
            dates[jour] = datetime.strftime(lundi + timedelta(days=i), "%d-%m-%Y")
        titre.append(dates)

        niveauParcours = premierEdt.numParcours.niveauParcours.filter(
            niveau=premierEdt.numClasse.niveau
        ).first()
        npDonnee = NiveauParcoursSerializer(niveauParcours).data
        titre.append(niveauParcours.numNiveauParcours)
        titre.append(list(edts.values_list("numEdt", flat=True)))

        donnees = {"titre": titre}
        contenu = []
        nbGroupe = Classe.objects.filter(
            niveau=niveauParcours.niveau,
            constituers__numParcours__numParcours=npDonnee["numParcours"],
        ).count()
        edtGroupe = defaultdict(list)

        for edt in edts:
            edtGroupe[f"{edt.heureDebut}-{edt.heureFin}"].append(edt)

        for horaire, groupeEdt in edtGroupe.items():
            donnee = {
                "Horaire": {
                    "heureDebut": horaire.split("-")[0],
                    "heureFin": horaire.split("-")[1],
                }
            }
            edtJour = defaultdict(list)
            for edt in groupeEdt:
                edtDonnee = EdtSerializer(edt).data
                d = {
                    "numEdt": edt.numEdt,
                    "matiere": edtDonnee["numMatiere"],
                    "professeur": edtDonnee["numProfesseur"],
                    "parcours": edtDonnee["numParcours"],
                    "salle": edtDonnee["numSalle"],
                    "classe": edtDonnee["numClasse"],
                }
                jourCle = next(
                    (
                        k
                        for k, v in dates.items()
                        if v == datetime.strftime(edt.date, "%d-%m-%Y")
                    ),
                    None,
                )
                edtJour[jourCle].append(d)

            for jour in jours:
                edtJour[jour] += [{}] * (nbGroupe - len(edtJour[jour]))
            donnee = donnee | edtJour
            contenu.append(donnee)

        donnees["contenu"] = contenu
        return {"context": donnees, "status": status.HTTP_200_OK}
    return {
        "context": EdtSerializer(edts, many=True).data,
        "status": status.HTTP_200_OK,
    }


def add_value_on_list_edt(edtSemaines):
    donnees = []
    for edtSemaine in edtSemaines:
        niveauParcours = (
            NiveauParcours.objects.filter(
                niveau=edtSemaine["numClasse__niveau"],
                numParcours=edtSemaine["numParcours"],
            )
            .values("numNiveauParcours", "niveau", "numParcours__codeParcours")
            .first()
        )
        lundi = edtSemaine["dateDebut"] - timedelta(
            days=edtSemaine["dateDebut"].weekday()
        )
        samedi = lundi + timedelta(days=5)
        donnee = {
            "niveauParcours": f"{niveauParcours['niveau']} {niveauParcours['numParcours__codeParcours']}",
            "dateDebut": datetime.strftime(lundi, "%d-%m-%Y"),
            "dateFin": datetime.strftime(samedi, "%d-%m-%Y"),
        }
        numEdts = Edt.objects.filter(
            numClasse__niveau=edtSemaine["numClasse__niveau"],
            numParcours=edtSemaine["numParcours"],
            date__range=(edtSemaine["dateDebut"], edtSemaine["dateFin"]),
        ).values_list("numEdt", flat=True)
        donnee["numEdts"] = list(numEdts)

        donnees.append(donnee)

    donnees = sorted(donnees, key=lambda d: sum(d["numEdts"]), reverse=True)
    return donnees
