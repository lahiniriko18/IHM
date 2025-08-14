from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta, datetime
from ...models import Edt
from ....etablissements.models import NiveauParcours
from ...services.serviceMail import ServiceMailEdtProfesseur
from ...serializers.serializerEdtProfesseur import EdtProfesseurSerializer
from ...services.serviceExcel import ServiceCreerExcel
from common.services.serviceEdt import listeEdtParNumEdts


class EdtDetailView(APIView):

    def post(self, request):
        donnee = request.data
        numEdts = donnee.get("numEdts")
        if not isinstance(numEdts, list):
            numEdts = donnee.getlist("numEdts[]")

        if any(not str(numEdt).isdigit() for numEdt in numEdts):
            return Response(
                {"erreur": "Type de données invalide !"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        response = listeEdtParNumEdts(numEdts)
        return Response({"donnee": response["context"]}, status=response["status"])

    def get(self, request):
        try:
            dernierEdt = Edt.objects.latest("numEdt")
            lundi = dernierEdt.date - timedelta(days=dernierEdt.date.weekday())
            samedi = lundi + timedelta(days=5)
            numEdts = Edt.objects.filter(date__range=(lundi, samedi)).values_list(
                "numEdt", flat=True
            )

            donnee = {
                "niveauParcours": f"{dernierEdt.numClasse.niveau} {dernierEdt.numParcours.codeParcours}",
                "dateDebut": datetime.strftime(lundi, "%d-%m-%Y"),
                "dateFin": datetime.strftime(samedi, "%d-%m-%Y"),
                "numEdts": list(numEdts),
            }
            return Response(donnee, status=status.HTTP_200_OK)
        except Edt.DoesNotExist:
            return Response({}, status=status.HTTP_200_OK)


class EdtProfesseurView(APIView):
    def post(self, request):
        numEdts = request.data.get("numEdts")
        if not isinstance(numEdts, list):
            numEdts = request.data.getlist("numEdts[]")

        if any(not str(numEdt).isdigit() for numEdt in numEdts):
            return Response(
                {"erreur": "Format de données invalide !"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        numEdts = list(map(int, numEdts))
        premierEdt = Edt.objects.filter(pk__in=numEdts).first()
        lundi = premierEdt.date - timedelta(days=premierEdt.date.weekday())
        samedi = premierEdt.date + timedelta(days=5)
        lundi = datetime.strftime(lundi, "%d-%m-%Y")
        samedi = datetime.strftime(samedi, "%d-%m-%Y")

        sexes = {"masculin": "Mr", "féminin": "Mme"}

        serviceEdtProf = ServiceMailEdtProfesseur()
        response = serviceEdtProf.donneeProfesseurEdt(numEdts)
        donneeEdts = response["context"]

        listeBuffer = []
        professeurs = []
        titres = []
        for donneEdt in donneeEdts:
            data = {
                "nomProfesseur": f"{sexes[donneEdt['professeur']['sexe'].lower()]} {donneEdt['professeur']['nomCourant']}",
                "dateDebut": lundi,
                "dateFin": samedi,
            }
            serializer = EdtProfesseurSerializer(data=data)
            if serializer.is_valid():
                donnee = serializer.validated_data
                serviceExcel = ServiceCreerExcel(1, donnee["titre1"], donnee["titre2"])
                buffer = serviceExcel.modeleEdtProf(donnee["semaine"], donneEdt)
                listeBuffer.append(buffer)
                professeurs.append(donneEdt["professeur"])
                titres.append(donnee["titre2"])
            else:
                return Response(serializer.errors)

        for i, buffer in enumerate(listeBuffer):
            serviceEdtProf.distribuerMail(buffer, professeurs[i], titres[i])
        return Response("Email envoyé avec succès !", status=status.HTTP_200_OK)


class EdtVerificationView(APIView):
    def post(self, request):
        donnee = request.data
        try:
            dateDebut = datetime.strptime(donnee["dateDebut"], "%d-%m-%Y").date()
        except ValueError:
            return Response(
                {"erreur": "Type de données invalide !"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        lundi = dateDebut - timedelta(days=dateDebut.weekday())
        samedi = dateDebut + timedelta(days=5)
        numNp = donnee.get("numNiveauParcours")
        niveauParcours = NiveauParcours.objects.filter(pk=numNp).first()
        verifEdt = Edt.objects.filter(
            date__range=(lundi, samedi),
            numParcours=niveauParcours.numParcours.numParcours,
            numClasse__niveau=niveauParcours.niveau,
        ).exists()
        return Response(verifEdt, status=status.HTTP_200_OK)
