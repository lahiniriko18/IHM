from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializer.serializerSalle import SalleSerializer,SalleStatSerializer
from ...models import Salle
from datetime import datetime,timedelta

class SalleStatView(APIView):
    def get(self, request):
        serializer=SalleStatSerializer(data=request.data)
        if serializer.is_valid():
            donnee=serializer.validated_data
            salles=Salle.objects.all()
            donnees=SalleSerializer(salles, many=True).data
            
            for i, salle in enumerate(salles):
                edts=salle.edts.filter(date__range=(donnee['dateDebut'],donnee['dateFin']))
                heureTotal=timedelta()
                for edt in edts:
                    debut=datetime.combine(datetime.today(), edt.heureDebut)
                    fin=datetime.combine(datetime.today(), edt.heureFin)
                    heureTotal += (fin - debut)
                donnees[i]["heureTotal"]=heureTotal
            
            donnees=sorted(donnees, key=lambda edt:edt["heureTotal"], reverse=True)
            for donnee in donnees:
                h=donnee["heureTotal"].total_seconds() // 3600
                m= (donnee["heureTotal"].total_seconds() % 3600 ) // 60
                donnee["heureTotal"]=f"{int(h):02d}h {int(m):02d}min"
            return Response(donnees, status=status.HTTP_200_OK)
        return Response({"erreur":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)