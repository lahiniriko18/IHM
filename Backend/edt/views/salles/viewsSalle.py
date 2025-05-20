from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializer.serializerSalle import SalleSerializer
from ...models import Salle
from datetime import date,datetime
class SalleView(APIView):
    def get(self, request):
        salles=Salle.objects.all().order_by('-numSalle')
        serializer=SalleSerializer(salles, many=True)
        donnees=serializer.data
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

        return Response(donnees)
    
    
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
    def delete(self, request):
        numSalles=request.data.get('numSalles',[])
        if not isinstance(numSalles, list):
            numSalles=request.data.getlist('numSalles[]')

        if any(isinstance(numSalle, str) for numSalle in numSalles):
            return Response({"erreur":"Type de données invalide !"})

        salles=Salle.objects.filter(numSalle__in=numSalles)
        if salles:
            for salle in salles:
                salle.delete()
            return Response({"Suppression avec succès !"},status=status.HTTP_200_OK)
        return Response({"erreur":"Salles introuvables !"}, status=status.HTTP_404_NOT_FOUND)