from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerClasse import ClasseSerializer
from ..serializer.serializerGroupe import GroupeSerializer
from ..serializer.serializerConstituer import ConstituerSerializer
from ..serializer.serializerParcours import ParcoursSerializer
from ..models import Classe,Groupe,Parcours
from django.db.models import Q
class ClasseView(APIView):
    def get(self, request):
        classes=Classe.objects.all()
        serializer=ClasseSerializer(classes, many=True)
        donneeClasse=serializer.data
        donnees=[]
        for i,classe in enumerate(classes):
            
            constituers=classe.constituers.filter()
            parcours=[]
            for c in constituers:
                parcours.append(ParcoursSerializer(c.numParcours).data)
            donneeGroupe=Groupe.objects.filter(numClasse=classe.numClasse)
            groupes=GroupeSerializer(donneeGroupe, many=True).data

            for parcour in parcours:
                for groupe in groupes:
                    donnees.append(ClasseSerializer(classe).data)
                    donnees[-1]['parcours']=parcour
                    donnees[-1]['groupes']=groupe

        return Response(donnees)
    
    def post(self, request):
        donnees=request.data
        groupeDonnee=donnees.get('groupe')
        numParcours=donnees.get('parcours')
        donneeClasse={"niveau":donnees.get('niveau')}

        if numParcours:
            parcours=Parcours.objects.filter(pk=numParcours).exists()
            if not parcours:
                return Response("Parcours introuvable !",status=status.HTTP_404_NOT_FOUND)
            
        classe=Classe.objects.filter(niveau=donnees.get('niveau').upper()).first()
        if not classe:
            serializer=ClasseSerializer(data=donneeClasse)
            if serializer.is_valid():
                classe=serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        if groupeDonnee:
            groupe=classe.groupes.filter().first()
            if not groupe:
                donneeGroupe={
                    "nomGroupe":f"Groupe {groupeDonnee}",
                    "numClasse":classe.numClasse
                }
                serializerGroupe=GroupeSerializer(data=donneeGroupe)
                if serializerGroupe.is_valid():
                    groupe=serializerGroupe.save()
                else:
                    return Response(serializerGroupe.errors, status=status.HTTP_400_BAD_REQUEST)
        if numParcours :
            constituer=classe.constituers.filter(numParcours=numParcours).exists()
            if not constituer:
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


class ModifClasseView(APIView):
    def post(self, request):
        donnee=request.data
        numGroupeDonnee=donnee.get('numGroupe')
        numParcoursDonnee=donnee.get('numParcours')
        try:
            classe=Classe.objects.get(pk=donnee["numClasse"])
        except Classe.DoesNotExist:
            return Response({"erreur":"Classe introuvable"}, status=status.HTTP_404_NOT_FOUND)
        donnees=ClasseSerializer(classe).data
        donnees['groupe']=None
        donnees['parcours']=None
        if numGroupeDonnee:
            posseder=classe.posseders.filter(numGroupe=numGroupeDonnee).first()
            donnees['groupe']=GroupeSerializer(posseder.numGroupe).data
        if numParcoursDonnee:
            constitue=classe.constituers.filter(numParcours=numParcoursDonnee).first()
            donnees['parcours']=ParcoursSerializer(constitue.numParcours).data

        return Response(donnees, status=status.HTTP_200_OK)