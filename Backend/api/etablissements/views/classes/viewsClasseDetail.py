from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializers.serializerClasse import ClasseSerializer
from ...serializers.serializerParcours import ParcoursSerializer
from ...serializers.serializerNiveauParcours import NiveauParcoursSerializer
from ...models import Classe, Parcours, NiveauParcours


class ClasseDetailView(APIView):

    def get(self, request, numClasse):

        classe = Classe.objects.filter(pk=numClasse).first()
        if classe:
            donneeClasse = []
            constituers = classe.constituers.filter()
            parcours = []
            for c in constituers:
                parcours.append(ParcoursSerializer(c.numParcours).data)
            if len(parcours) > 0:
                for p in parcours:
                    donneeClasse.append(ClasseSerializer(classe).data)
                    donneeClasse[-1]["parcours"] = p
            else:
                donneeClasse.append(ClasseSerializer(classe).data)
                donneeClasse[-1]["parcours"] = ""
            return Response(donneeClasse, status=status.HTTP_200_OK)
        else:
            return Response(
                {"erreur": "Classe introuvable !"}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request):
        numClasses = request.data.get("numClasses", [])
        if not isinstance(numClasses, list):
            numClasses = request.data.getlist("numClasses[]")

        if any(isinstance(numClasse, str) for numClasse in numClasses):
            return Response({"erreur": "Type de données invalide !"})

        classes = Classe.objects.filter(numClasse__in=numClasses)
        if classes:
            for classe in classes:
                classe.delete()
            return Response({"Suppression avec succès !"}, status=status.HTTP_200_OK)
        return Response(
            {"erreur": "Classes introuvables !"}, status=status.HTTP_404_NOT_FOUND
        )


class ClasseNiveauParcoursView(APIView):
    def get(self, request, numNiveauParcours):
        niveauParcours = NiveauParcoursSerializer(
            NiveauParcours.objects.filter(pk=numNiveauParcours).first()
        ).data

        if niveauParcours:
            classes = Classe.objects.filter(
                niveau=niveauParcours["niveau"],
                constituers__numParcours__numParcours=niveauParcours["numParcours"],
            )
            donnees = ClasseSerializer(classes, many=True).data
            for i, classe in enumerate(classes):
                parcours = Parcours.objects.filter(
                    constituers__numClasse__numClasse=classe.numClasse
                )
                donnees[i]["parcours"] = ParcoursSerializer(parcours, many=True).data
            return Response(donnees, status=status.HTTP_200_OK)
        return Response(
            {"erreur": "Niveau avec parcours introuvable !"},
            status=status.HTTP_404_NOT_FOUND,
        )
