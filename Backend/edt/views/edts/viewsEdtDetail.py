from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta
from ...models import Edt
from .viewsEdtUtile import EdtListage

class EdtDetailView(APIView):
    
    def post(self, request):
        donnee=request.data
        numEdts=donnee.get('numEdts',[])
        if not isinstance(numEdts, list):
            numEdts=donnee.getlist('numEdts[]')

        if any(isinstance(numEdt, str) for numEdt in numEdts):
            return Response({"erreur":"Type de données invalide !"})
        
        eg=EdtListage()
        response = eg.listeEdtParNumEdts(numEdts)

        return Response(response['context'], status=response['status'])
    
    def get(self, request):
        dernierEdt = Edt.objects.latest('numEdt')
        lundi = dernierEdt.date - timedelta(days=dernierEdt.date.weekday())
        samedi = lundi + timedelta()
        numEdts = Edt.objects.filter(date__range=(lundi, samedi)).values_list('numEdt', flat=True)

        eg=EdtListage()
        response = eg.listeEdtParNumEdts(list(numEdts))

        return Response(response['context'], status=response['status'])