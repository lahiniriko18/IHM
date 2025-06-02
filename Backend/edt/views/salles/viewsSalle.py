from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializer.serializerSalle import SalleSerializer
from ...models import Salle,Edt
from django.db.models import Q
from datetime import date,datetime,timedelta
from ...services.serviceModel import ServiceModelCrud
class SalleView(APIView):
    def get(self, request):
        salles=Salle.objects.all().order_by('-numSalle')
        donnees=SalleSerializer(salles, many=True).data
        dateActuel=date.today()
        heureActuel=datetime.now().time()
        for i,salle in enumerate(salles):
            edt=salle.edts.filter(date=dateActuel,heureDebut__lte=heureActuel,heureFin__gte=heureActuel).exists()
            if edt == salle.statut:
                donnees[i]["statut"]=not edt
                serializerModif=SalleSerializer(salle,donnees[i])
                if serializerModif.is_valid():
                    serializerModif.save()
                else:
                    return Response(serializerModif.errors,status=status.HTTP_400_BAD_REQUEST)
            edts=salle.edts.all()
            heureTotal=timedelta()
            for edt in edts:
                debut=datetime.combine(datetime.today(), edt.heureDebut)
                fin=datetime.combine(datetime.today(), edt.heureFin)
                heureTotal += (fin - debut)
            donnees[i]["heureTotal"]=heureTotal.total_seconds()
        return Response(donnees, status=status.HTTP_200_OK)
    
    
    def post(self, request):
        serializer=SalleSerializer(data=request.data)
        if serializer.is_valid():
            salle=serializer.save()
            return Response(SalleSerializer(salle).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numSalle):
        try:
            salle=Salle.objects.get(pk=numSalle)
        except Salle.DoesNotExist:
            return Response({"erreur":"Salle introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=SalleSerializer(salle, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numSalle):
        try:
            salle=Salle.objects.get(pk=numSalle)
            salle.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Salle.DoesNotExist:
            return Response({'erreur':'Salle introuvable'}, status=status.HTTP_404_NOT_FOUND)

class SalleDetailView(APIView):
    def post(self, request):
        serviceCrud=ServiceModelCrud(Salle)
        response=serviceCrud.suppressionMutlipe(request.data, "numSalles","Salles")
        return Response(response['context'], status=response['status'])
    

class SalleEdtView(APIView):
    def post(self, request):
        donnee=request.data
        heureDebut=donnee['heureDebut']
        heureFin=donnee['heureFin']
        try:
            dateVerif=datetime.strptime(donnee['date'], "%d-%m-%Y").date()
            heureDebut=datetime.strptime(heureDebut, "%H:%M").time()
            heureFin=datetime.strptime(heureFin, "%H:%M").time()
        except ValueError:
            return Response({"erreur":"Type de données invalide !"}, status=status.HTTP_401_UNAUTHORIZED)
        
        numSalles=Edt.objects.filter(Q(date=dateVerif) & Q(Q(heureDebut__range=(heureDebut,heureFin)) | Q(heureFin__range=(heureDebut,heureFin)))).values_list('numSalle', flat=True)
        print(list(numSalles))
        salles=Salle.objects.filter().exclude(pk__in=list(numSalles))
        for salle in salles:
            if not salle.statut:
                salle.statut=not salle.statut
                salle.save()
        
        donnees=SalleSerializer(salles, many=True).data
        return Response(donnees, status=status.HTTP_200_OK)