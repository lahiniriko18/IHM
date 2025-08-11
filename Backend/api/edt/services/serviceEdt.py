from datetime import datetime
from rest_framework import status
from ..serializers.serializerEdt import EdtSerializer
from ...etablissements.serializers.serializerNiveauParcours import (
    NiveauParcoursSerializer,
)
from ...etablissements.models import Constituer, NiveauParcours
from ..serializers.serializerEdt import EdtSerializer, EdtTableSerializer
from ...etablissements.serializers.serializerConstituer import ConstituerSerializer


class ServiceEdtCrud:
    def ajoutEdtListeDonnee(self, data, jours):
        print(data)
        serializer = EdtTableSerializer(data=data)

        if serializer.is_valid():

            donnee = serializer.validated_data
            contenu = donnee["contenu"]
            dates = donnee["titre"][0]
            niveauParcours = NiveauParcours.objects.filter(
                pk=donnee["titre"][1]
            ).first()
            npDonnee = NiveauParcoursSerializer(niveauParcours).data

            if len(contenu) > 1:
                heureCourant = contenu[0]["Horaire"]["heureFin"]
                for i in range(1, len(contenu)):
                    if heureCourant > contenu[i]["Horaire"]["heureDebut"]:
                        return {
                            "context": {
                                "erreur": f"L'heure de fin dans la ligne {i} doit inférieure ou égale à l'heure de début de la ligne {i+1} dans le colonne de horaire !"
                            },
                            "status": status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
                        }
                    heureCourant = contenu[i]["Horaire"]["heureFin"]

            if len(contenu) > 0:

                donneEdts = []
                donneeConstituer = []
                for ligne in contenu:
                    horaire = ligne["Horaire"]
                    for jour in jours:
                        valeurJour = ligne.get(jour)
                        for val in valeurJour:
                            if isinstance(val, dict) and val:
                                dateObj = datetime.strptime(dates.get(jour), "%d-%m-%Y")
                                dateSql = dateObj.strftime("%Y-%m-%d")

                                constiuer = Constituer.objects.filter(
                                    numClasse=val["classe"],
                                    numParcours=npDonnee["numParcours"],
                                ).exists()
                                if not constiuer:
                                    donneeConstituer.append(
                                        {
                                            "numParcours": npDonnee["numParcours"],
                                            "numClasse": val["classe"],
                                        }
                                    )
                                donneEdt = {
                                    "numMatiere": val["matiere"],
                                    "numProfesseur": val["professeur"],
                                    "numParcours": npDonnee["numParcours"],
                                    "numSalle": val["salle"],
                                    "numClasse": val["classe"],
                                    "date": dateSql,
                                    "heureDebut": horaire["heureDebut"],
                                    "heureFin": horaire["heureFin"],
                                }
                                donneEdts.append(donneEdt)

                serializerConstituer = ConstituerSerializer(
                    data=donneeConstituer, many=True
                )
                if serializerConstituer.is_valid():
                    serializerConstituer.save()
                serializerEdt = EdtSerializer(data=donneEdts, many=True)
                if serializerEdt.is_valid():

                    serializerEdt.save()
                else:
                    print("Eto 2")
                    return {
                        "context": serializerEdt.errors,
                        "status": status.HTTP_401_UNAUTHORIZED,
                    }

            return {
                "context": {"message": "Ajout d'emploi du temps avec succès !"},
                "status": status.HTTP_200_OK,
            }
        print("ato izy mety")
        return {"context": serializer.errors, "status": status.HTTP_401_UNAUTHORIZED}
