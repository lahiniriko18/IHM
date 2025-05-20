from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializer.serializerMatiere import MatiereSerializer
from ...serializer.serializerPosseder import PossederSerializer
from ...serializer.serializerEnseigner import EnseignerSerializer
from ...models import Matiere

class MatiereView(APIView):
    def get(self, request):
        matieres=Matiere.objects.all().order_by('-numMatiere')
        serializer=MatiereSerializer(matieres, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        donnees=request.data
        
        niveauParcours=donnees.get('niveauParcours')
        if not isinstance(niveauParcours, list):
            niveauParcours=donnees.getlist('niveauParcours[]')
        professeurs=donnees.get('professeurs')
        if not isinstance(professeurs, list):
            professeurs=donnees.getlist('professeurs[]')
        serializer=MatiereSerializer(data=request.data)
        if serializer.is_valid():
            matiere=serializer.save()
            if niveauParcours and len(niveauParcours) > 0:
                donneeNp=[]
                for niveauParcour in niveauParcours:
                    donneeNp.append({
                        "numNiveauParcours":niveauParcour,
                        "numMatiere":matiere.numMatiere
                    })
                serializerPossede=PossederSerializer(data=donneeNp, many=True)
                if serializerPossede.is_valid():
                    serializerPossede.save()
                else:
                    return Response(serializerPossede.errors, status=status.HTTP_400_BAD_REQUEST)
            if professeurs and len(professeurs) > 0:
                donneeEns=[]
                for professeur in professeurs:
                    donneeEns.append({
                        "numProfesseur":professeur,
                        "numMatiere":matiere.numMatiere
                    })
                print(donneeEns)
                serializerEns=EnseignerSerializer(data=donneeEns, many=True)
                if serializerEns.is_valid():
                    serializerEns.save()
                else:
                    return Response(serializerEns.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(MatiereSerializer(matiere).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    def put(self, request, numMatiere):
        try:
            matiere=Matiere.objects.get(pk=numMatiere)
        except Matiere.DoesNotExist:
            return Response({"erreur":"Matière introuvable"}, status=status.HTTP_404_NOT_FOUND)
        
        donnees = request.data.copy()
        niveauParcours=donnees.get('niveauParcours')
        if not isinstance(niveauParcours, list):
            niveauParcours=donnees.getlist('niveauParcours[]')
        professeurs=donnees.get('professeurs')
        if not isinstance(professeurs, list):
            professeurs=donnees.getlist('professeurs[]')
        professeurs=list(map(int, professeurs))
        serializer=MatiereSerializer(matiere, data=request.data)
        if serializer.is_valid():
            matiere=serializer.save()
            if isinstance(niveauParcours, list):
                posseders=matiere.posseders.filter()
                dataPossede=PossederSerializer(posseders, many=True).data

                npPossede=[p['numNiveauParcours'] for p in dataPossede]
                donneePossede=[]
                for np in niveauParcours:
                    if np not in npPossede:
                        donneePossede.append({
                            "numNiveauParcours":np,
                            "numMatiere":matiere.numMatiere
                        })
                if sorted(npPossede) != sorted(niveauParcours):
                    for p in posseders:
                        if p.numNiveauParcours not in niveauParcours:
                            p.delete()
                if len(donneePossede) > 0:
                    serializerPossede=PossederSerializer(data=donneePossede, many=True)
                    if serializerPossede.is_valid():
                        serializerPossede.save()
                    else:
                        return Response(serializerPossede.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"erreur":"Type de données du matière invalide !"}, status=status.HTTP_401_UNAUTHORIZED)
            
            if isinstance(professeurs, list):
                enseigners=matiere.enseigners.filter()
                profEns=list(enseigners.values_list('numProfesseur', flat=True))

                donneeEns=[]
                for numProfesseur in professeurs:
                    if numProfesseur not in profEns:
                        donneeEns.append({
                            "numMatiere":matiere.numMatiere,
                            "numProfesseur":numProfesseur
                        })
                if sorted(profEns) != sorted(professeurs):
                    for ens in enseigners:
                        if ens.numProfesseur not in professeurs:
                            ens.delete()
                if len(donneeEns) > 0:
                    serializerEns=EnseignerSerializer(data=donneeEns, many=True)
                    if serializerEns.is_valid():
                        serializerEns.save()
                    else:
                        return Response(serializerEns.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"erreur":"Type de données du matière invalide !"}, status=status.HTTP_401_UNAUTHORIZED)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numMatiere):
        try:
            matiere=Matiere.objects.get(pk=numMatiere)
            matiere.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Matiere.DoesNotExist:
            return Response({'erreur':'Matière introuvable'}, status=status.HTTP_404_NOT_FOUND)