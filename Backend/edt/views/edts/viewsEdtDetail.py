from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...models import Edt
from ...serializer.serializerEdt import EdtSerializer
from ...serializer.serializerMatiere import MatiereSerializer
from ...serializer.serializerClasse import ClasseSerializer
from ...serializer.serializerParcours import ParcoursSerializer
from ...serializer.serializerSalle import SalleSerializer


class EdtDetailView(APIView):
    def post(self, request):
        donnee=request.data
        numEdts=donnee.get('numEdts',[])
        if not isinstance(numEdts, list):
            numEdts=donnee.getlist('numEdts[]')

        if any(isinstance(numEdt, str) for numEdt in numEdts):
            return Response({"erreur":"Type de données invalide !"})
        
        edts=Edt.objects.filter(numEdt__in=numEdts)
        donnees=[]

        for edt in edts:
            # donnee={
            #     "numEdt":edt.numEdt,
            #     "matiere":edt.numMatiere.nomMatiere,
            #     "parcours":edt.numParcours.codeParcours,
            #     "salle":edt.numSalle.nomSalle,
            #     "classe":f"{edt.numClasse.niveau} {edt.numClasse.groupe}",
            #     "date":edt.date,
            #     "heureDebut":edt.heureDebut,
            #     "heureFin":edt.heureFin
            # }

            donnee={
                "numEdt":edt.numEdt,
                "matiere":MatiereSerializer(edt.numMatiere).data,
                "parcours":ParcoursSerializer(edt.numParcours).data,
                "salle":SalleSerializer(edt.numSalle).data,
                "classe":ClasseSerializer(edt.numClasse).data,
                "date":edt.date,
                "heureDebut":edt.heureDebut,
                "heureFin":edt.heureFin
            }
            donnees.append(donnee)

        return Response(donnees)