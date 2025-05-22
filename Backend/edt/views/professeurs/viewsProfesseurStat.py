from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializer.serializerProfesseur import ProfesseurStatSerializer
from ...models import Professeur,Edt
from datetime import datetime,timedelta

class ProfesseurStatView(APIView):
    def get(self, request):
        serializer=ProfesseurStatSerializer(data=request.data)
        if serializer.is_valid():
            donnee=serializer.validated_data
            professeur=Professeur.objects.filter(pk=donnee['numProfesseur']).exists()
            if professeur:
                edts=Edt.objects.filter(date__range=(donnee['dateDebut'],donnee['dateFin']), numProfesseur=donnee['numProfesseur'])
                heureTotal=timedelta()

                for edt in edts:
                    debut=datetime.combine(datetime.today(), edt.heureDebut)
                    fin=datetime.combine(datetime.today(), edt.heureFin)
                    heureTotal += (fin - debut)
                heures=heureTotal.total_seconds() // 3600
                minutes=(heureTotal.total_seconds() % 3600) // 60
                
                return Response(f"{int(heures):02d}h {int(minutes):02d}min",status=status.HTTP_200_OK)
            return Response({"erreur":"Professeur introuvable !"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"erreur":serializer.errors},status=status.HTTP_400_BAD_REQUEST)

