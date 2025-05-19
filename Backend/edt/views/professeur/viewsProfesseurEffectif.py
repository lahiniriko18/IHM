from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializer.serializerProfesseur import ProfesseurEffectifSerializer
from ...models import Professeur,Edt
from datetime import datetime,timedelta

class ProfesseurEffectifView(APIView):
    def post(self, request):
        serializer=ProfesseurEffectifSerializer(data=request.data)
        if serializer.is_valid():
            donnee=serializer.validated_data
            professeur=Professeur.objects.filter(pk=donnee['numProfesseur']).first()
            if professeur:
                numMatieres=professeur.enseigners.values_list('numMatiere', flat=True)
                edts=Edt.objects.filter(date__range=(donnee['dateDebut'],donnee['dateFin']), numMatiere__in=numMatieres)
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

