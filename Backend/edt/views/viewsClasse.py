from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerClasse import ClasseSerializer
from ..serializer.serializerGroupe import GroupeSerializer
from ..serializer.serializerPosseder import PossederSerializer
from ..serializer.serializerConstituer import ConstituerSerializer
from ..serializer.serializerParcours import ParcoursSerializer
from ..models import Classe,Groupe,Parcours
from django.db.models import Q
class ClasseView(APIView):
    def get(self, request):
        classes=Classe.objects.all()
        serializer=ClasseSerializer(classes, many=True)
        donnees=serializer.data
        for i,classe in enumerate(classes):
            posseders=classe.posseders.filter()
            constituers=classe.constituers.filter()
            donnneePossede=[]
            donnneeConstitue=[]
            for p in posseders:
                donnneePossede.append(GroupeSerializer(p.numGroupe).data)
            for c in constituers:
                donnneeConstitue.append(ParcoursSerializer(c.numParcours).data)
            donnees[i]["groupes"]=donnneePossede
            donnees[i]["parcours"]=donnneeConstitue
        return Response(donnees)
    
    def post(self, request):
        donnees=request.data
        groupeDonnee=donnees.get('groupe')
        numGroupe=None
        numParcours=donnees.get('parcours')
        donneeClasse={"niveau":donnees.get('niveau')}
        if groupeDonnee:
            groupe=Groupe.objects.filter(nomGroupe=groupeDonnee.strip()).first()
            if groupe:
                numGroupe=groupe.numGroupe
            else:
                serializerGroupe=GroupeSerializer(data={"nomGroupe":f"Groupe {groupeDonnee.strip()}"})
                if serializerGroupe.is_valid():
                    groupe=serializerGroupe.save()
                    numGroupe=groupe.numGroupe
                else:
                    return Response(serializerGroupe.errors, status=status.HTTP_400_BAD_REQUEST)
        if numParcours:
            parcours=Parcours.objects.filter(pk=numParcours).exists()
            if not parcours:
                return Response("Parcours introuvable !",status=status.HTTP_404_NOT_FOUND)
        serializer=ClasseSerializer(data=donneeClasse)
        if serializer.is_valid():
            classe=serializer.save()
            if numGroupe:
                donneePosseder={
                    "numClasse":classe.numClasse,
                    "numGroupe":numGroupe
                }
                serializerPossede=PossederSerializer(data=donneePosseder)
                if serializerPossede.is_valid():
                    serializerPossede.save()
                else:
                    return Response(serializerPossede.errors, status=status.HTTP_400_BAD_REQUEST)
            if numParcours:
                donneeConstituer={
                    "numClasse":classe.numClasse,
                    "numParcours":numParcours
                }
                serializerConstitue=ConstituerSerializer(data=donneeConstituer)
                if serializerConstitue.is_valid():
                    serializerConstitue.save()
                else:
                    return Response(serializerConstitue.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(ClasseSerializer(classe).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numClasse):
        try:
            classe=Classe.objects.get(pk=numClasse)
        except Classe.DoesNotExist:
            return Response({"erreur":"Classe introuvable"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer=ClasseSerializer(classe, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numClasse):
        try:
            classe=Classe.objects.get(pk=numClasse)
            classe.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Classe.DoesNotExist:
            return Response({'erreur':'Classe introuvable'}, status=status.HTTP_404_NOT_FOUND)


# class ModifClasseView(APIView):
#     def get(self, request, numClasse):
#         try:
#             classe=Classe.objects.get(pk=numClasse)
#         except Classe.DoesNotExist:
#             return Response({"erreur":"Classe introuvable"}, status=status.HTTP_404_NOT_FOUND)
#         posseder=classe.posseders.filter()