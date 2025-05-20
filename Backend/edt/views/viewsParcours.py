from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerParcours import ParcoursSerializer
from ..models import Parcours
class ParcoursView(APIView):
    def get(self, request):
        parcours=Parcours.objects.all().order_by('-numParcours')
        serializer=ParcoursSerializer(parcours, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer=ParcoursSerializer(data=request.data)
        if serializer.is_valid():
            parcours=serializer.save()
            return Response(ParcoursSerializer(parcours).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numParcours):
        try:
            parcours=Parcours.objects.get(pk=numParcours)
        except Parcours.DoesNotExist:
            return Response({"erreur":"Parcours introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=ParcoursSerializer(parcours, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numParcours):
        try:
            parcours=Parcours.objects.get(pk=numParcours)
            parcours.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Parcours.DoesNotExist:
            return Response({'erreur':'Parcours introuvable'}, status=status.HTTP_404_NOT_FOUND)
        
class ParcourDetailView(APIView):
    def delete(self, request):
        numParcours=request.data.get('numParcours',[])
        if not isinstance(numParcours, list):
            numParcours=request.data.getlist('numParcours[]')

        if any(isinstance(numeroP, str) for numeroP in numParcours):
            return Response({"erreur":"Type de données invalide !"})

        parcours=Parcours.objects.filter(numParcour__in=numParcours)
        if parcours:
            for p in parcours:
                p.delete()
            return Response({"Suppression avec succès !"},status=status.HTTP_200_OK)
        return Response({"erreur":"Parcours introuvables !"}, status=status.HTTP_404_NOT_FOUND)