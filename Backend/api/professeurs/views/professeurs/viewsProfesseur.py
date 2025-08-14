from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Professeur
from ...serializers.serializerEnseigner import EnseignerSerializer
from ...serializers.serializerProfesseur import ProfesseurSerializer


class ProfesseurView(APIView):
    def get(self, request):
        professeurs = Professeur.objects.all().order_by("-numProfesseur")
        serializer = ProfesseurSerializer(
            professeurs, many=True, context={"request": request}
        )
        donnees = serializer.data
        return Response(donnees, status=status.HTTP_200_OK)

    def post(self, request):
        donnees = request.data
        numMatieres = donnees.get("matieres")
        if not isinstance(numMatieres, list):
            numMatieres = donnees.getlist("matieres[]")
        serializer = ProfesseurSerializer(data=donnees, context={"request": request})
        if serializer.is_valid():
            professeur = serializer.save()
            donnee = ProfesseurSerializer(professeur, context={"request": request}).data
            if isinstance(numMatieres, list):
                if len(numMatieres) > 0:
                    donneeEns = []
                    for numMatiere in numMatieres:
                        donneeEns.append(
                            {
                                "numProfesseur": professeur.numProfesseur,
                                "numMatiere": numMatiere,
                            }
                        )
                    serializerEns = EnseignerSerializer(data=donneeEns, many=True)
                    if serializerEns.is_valid():
                        serializerEns.save()
                    else:
                        return Response(
                            serializerEns.errors, status=status.HTTP_400_BAD_REQUEST
                        )
            else:
                return Response(
                    {"erreur": "Type de données du matière invalide !"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            return Response(donnee, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, numProfesseur):
        try:
            professeur = Professeur.objects.get(pk=numProfesseur)
        except Professeur.DoesNotExist:
            return Response(
                {"erreur": "Professeur introuvable !"}, status=status.HTTP_404_NOT_FOUND
            )

        donnees = request.data
        numMatieres = donnees.get("matieres")
        if not isinstance(numMatieres, list):
            numMatieres = donnees.getlist("matieres[]")
        numMatieres = list(map(int, numMatieres))
        serializer = ProfesseurSerializer(
            professeur, data=donnees, context={"request": request}
        )
        if serializer.is_valid():
            prof = serializer.save()
            donnee = ProfesseurSerializer(prof, context={"request": request}).data

            if isinstance(numMatieres, list):
                enseigners = prof.enseigners.filter()
                dataEns = EnseignerSerializer(enseigners, many=True).data
                matiereEns = [ens["numMatiere"] for ens in dataEns]
                donneeEns = []
                for numMatiere in numMatieres:
                    if numMatiere not in matiereEns:
                        donneeEns.append(
                            {
                                "numProfesseur": prof.numProfesseur,
                                "numMatiere": numMatiere,
                            }
                        )
                if sorted(matiereEns) != sorted(numMatieres):
                    for ens in enseigners:
                        if ens.numMatiere.numMatiere not in numMatieres:
                            ens.delete()
                if len(donneeEns) > 0:
                    serializerEns = EnseignerSerializer(data=donneeEns, many=True)
                    if serializerEns.is_valid():
                        serializerEns.save()
                    else:
                        return Response(
                            serializerEns.errors, status=status.HTTP_400_BAD_REQUEST
                        )
            else:
                return Response(
                    {"erreur": "Type de données du matière invalide !"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            return Response(donnee, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, numProfesseur):
        try:
            professeur = Professeur.objects.get(pk=numProfesseur)
            print(professeur.numEtablissement)
            professeur.delete()
            return Response(
                {"message": "Suppression avec succès"}, status=status.HTTP_200_OK
            )
        except professeur.DoesNotExist:
            return Response(
                {"erreur": "Professeur introuvable !"}, status=status.HTTP_404_NOT_FOUND
            )
