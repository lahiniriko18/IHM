from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta,datetime
from ...models import Edt
from ...services.serviceEdt import ServiceEdtListage
from ...services.serviceMail import ServiceMailEdtProfesseur
from ...serializer.serializerEdtProfesseur import EdtProfesseurSerializer
from ...services.serviceExcel import ServiceCreerExcel

class EdtDetailView(APIView):
    
    def post(self, request):
        donnee=request.data
        numEdts=donnee.get('numEdts')
        if not isinstance(numEdts, list):
            numEdts=donnee.getlist('numEdts[]')

        if any(not str(numEdt).isdigit() for numEdt in numEdts):
            return Response({"erreur":"Type de données invalide !"})
        
        eg=ServiceEdtListage()
        response = eg.listeEdtParNumEdts(numEdts)

        return Response({"donnee":response['context']}, status=response['status'])
    
    def get(self, request):
        try:
            dernierEdt = Edt.objects.latest('numEdt')
            lundi = dernierEdt.date - timedelta(days=dernierEdt.date.weekday())
            samedi = lundi + timedelta(days=5)
            numEdts = Edt.objects.filter(date__range=(lundi, samedi)).values_list('numEdt', flat=True)

            donnee={
                'niveauParcours':f"{dernierEdt.numClasse.niveau} {dernierEdt.numParcours.codeParcours}",
                'dateDebut':datetime.strftime(lundi, "%d-%m-%Y"),
                'dateFin':datetime.strftime(samedi, "%d-%m-%Y"),
                'numEdts':list(numEdts)
            }
            return Response(donnee, status=status.HTTP_200_OK)
        except Edt.DoesNotExist:
            return Response({}, status=status.HTTP_200_OK)


class EdtProfesseurView(APIView):
    def post(self, request):
        numEdts=request.data.get('numEdts')
        if not isinstance(numEdts, list):
            numEdts = request.data.getlist('numEdts[]')

        if any(not str(numEdt).isdigit() for numEdt in numEdts):
            return Response({"erreur":"Format de données invalide !"}, status=status.HTTP_401_UNAUTHORIZED)
        numEdts=list(map(int, numEdts))
        premierEdt=Edt.objects.filter(pk__in=numEdts).first()
        lundi=premierEdt.date - timedelta(days=premierEdt.date.weekday())
        samedi=premierEdt.date + timedelta(days=5)
        lundi=datetime.strftime(lundi, "%d-%m-%Y")
        samedi=datetime.strftime(samedi, "%d-%m-%Y")

        sexes={
            "masculin":"Mr",
            "féminin":"Mme"
        }

        serviceEdtProf=ServiceMailEdtProfesseur()
        response=serviceEdtProf.donneeProfesseurEdt(numEdts)
        donneeEdts=response['context']

        listeBuffer=[]
        professeurs=[]
        titres=[]
        for donneEdt in donneeEdts:
            data={
                "nomProfesseur":f"{sexes[donneEdt['professeur']['sexe'].lower()]} {donneEdt['professeur']['nomCourant']}",
                "dateDebut":lundi,
                "dateFin":samedi
            }
            serializer=EdtProfesseurSerializer(data=data)
            if serializer.is_valid():
                donnee=serializer.validated_data
                serviceExcel=ServiceCreerExcel(1,donnee['titre1'], donnee['titre2'])
                buffer= serviceExcel.modeleEdtProf(donnee['semaine'],donneEdt)
                listeBuffer.append(buffer)
                professeurs.append(donneEdt['professeur'])
                titres.append(donnee['titre2'])
            else:
                return Response(serializer.errors)
        
        for i,buffer in enumerate(listeBuffer):
            print("zah")
            serviceEdtProf.distribuerMail(buffer,professeurs[i],titres[i])
        return Response("Email envoyé avec succès !", status=status.HTTP_200_OK)