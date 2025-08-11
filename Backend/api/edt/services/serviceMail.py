from rest_framework import status
from datetime import datetime, time
from ..models import Edt
from ...professeurs.models import Professeur
from ...professeurs.serializers.serializerProfesseur import ProfesseurSerializer
from collections import defaultdict
from django.core.mail import EmailMessage


class ServiceMailEdtProfesseur:
    def donneeProfesseurEdt(self, numEdts):
        numProfesseurs = list(
            Edt.objects.filter(pk__in=numEdts)
            .values_list("numProfesseur", flat=True)
            .distinct()
        )
        donnees = []
        sexes = {"masculin": "Mr", "féminin": "Mme"}
        if numProfesseurs:
            for numProf in numProfesseurs:
                edts = Edt.objects.filter(
                    numEdt__in=numEdts, numProfesseur=numProf
                ).order_by("heureDebut")
                donnee = defaultdict(list)
                professeur = Professeur.objects.filter(pk=numProf).first()
                donnee["professeur"] = ProfesseurSerializer(professeur).data
                for edt in edts:
                    date = datetime.strftime(edt.date, "%d-%m-%Y")
                    heureDebut = edt.heureDebut
                    heureDebutStr = (
                        f"{int(heureDebut.hour):02d}h"
                        if int(heureDebut.minute) == 0
                        else f"{int(heureDebut.hour):02d}h{int(heureDebut.minute):02d}"
                    )
                    heureFin = edt.heureFin
                    heureFinStr = (
                        f"{int(heureFin.hour):02d}h"
                        if int(heureFin.minute) == 0
                        else f"{int(heureFin.hour):02d}h{int(heureFin.minute):02d}"
                    )
                    d = {
                        "matiere": edt.numMatiere.nomMatiere,
                        "professeur": f"{sexes[edt.numProfesseur.sexe.lower()]} {edt.numProfesseur.nomCourant}",
                        "classe": f"{edt.numClasse.niveau} {edt.numParcours.codeParcours} {edt.numClasse.groupe}",
                        "salle": edt.numSalle.nomSalle,
                        "matinSoir": edt.heureDebut < time(12, 0, 0),
                        "heureDebut": heureDebutStr,
                        "heureFin": heureFinStr,
                    }

                    donnee[date].append(d)
                donnees.append(donnee)
            return {"context": donnees, "status": status.HTTP_200_OK}
        return {
            "context": {"erreur": "Aucun professeur pour ce emploi emploi du temps !"},
            "status": status.HTTP_404_NOT_FOUND,
        }

    def distribuerMail(self, buffer, professeur, titre):
        sexes = {"masculin": "Mr", "féminin": "Mme"}
        texte = f"Bonjour {sexes[professeur['sexe'].lower()]} {professeur['nomCourant']}, voiçi votre emploi du temps du {titre}"
        email = EmailMessage(
            subject="Emploi du temps", body=texte, to=[professeur["email"]]
        )
        email.attach(
            f"{professeur['nomCourant']}Edt.xlsx",
            buffer.read(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        email.send()
