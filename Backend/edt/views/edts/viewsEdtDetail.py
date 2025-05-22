from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta,datetime
from ...models import Edt
from ...services.serviceEdt import ServiceEdtListage
from ...services.serviceMail import ServiceMailEdtProfesseur

class EdtDetailView(APIView):
    
    def post(self, request):
        donnee=request.data
        numEdts=donnee.get('numEdts',[])
        if not isinstance(numEdts, list):
            numEdts=donnee.getlist('numEdts[]')

        if any(isinstance(numEdt, str) for numEdt in numEdts):
            return Response({"erreur":"Type de données invalide !"})
        
        eg=ServiceEdtListage()
        response = eg.listeEdtParNumEdts(numEdts)

        return Response(response['context'], status=response['status'])
    
    def get(self, request):
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


class EdtProfesseurView(APIView):
    def post(self, request):
        numEdts=request.data.get('numEdts')
        if not isinstance(numEdts, list):
            numEdts = request.data.getlist('numEdts[]')

        if any(not numEdt.isdigit() for numEdt in numEdts):
            return Response({"erreur":"Format de données invalide !"}, status=status.HTTP_401_UNAUTHORIZED)
        numEdts=list(map(int, numEdts))
        
        serviceEdtProf=ServiceMailEdtProfesseur()
        professeurs=serviceEdtProf.distriubuerMail(numEdts)
        return Response(professeurs)