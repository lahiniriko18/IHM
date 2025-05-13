from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerClasse import ClasseSerializer
from ..serializer.serializerConstituer import ConstituerSerializer
from ..serializer.serializerParcours import ParcoursSerializer
from ..models import Classe,Parcours,Constituer
from django.db.models import Q
class ClasseView(APIView):
    def get(self, request):
        classes=Classe.objects.all()
        donnees=[]
        for i,classe in enumerate(classes):
            constituers=classe.constituers.filter()
            parcours=[]
            for c in constituers:
                parcours.append(ParcoursSerializer(c.numParcours).data)

            if len(parcours) > 0:
                for parcour in parcours:
                    donnees.append(ClasseSerializer(classe).data)
                    donnees[-1]['parcours']=parcour
            else:
                donnees.append(ClasseSerializer(classe).data)
                donnees[-1]['parcours']=''
        return Response(donnees)
    
    def post(self, request):
        donnees=request.data
        numParcours=donnees.get('parcours')
        donneeClasse={
            "niveau":donnees.get('niveau'),
            "groupe":donnees.get('groupe')}

        if numParcours:
            parcours=Parcours.objects.filter(pk=numParcours).exists()
            if not parcours:
                return Response("Parcours introuvable !",status=status.HTTP_404_NOT_FOUND)
        
        
        classe=Classe.objects.filter(niveau=donneeClasse['niveau'].upper(), groupe=donneeClasse['groupe']).first()
        if classe:
            constitue=classe.constituers.filter(numParcours=numParcours).first()
            if not constitue:
                serializerConstitue=ConstituerSerializer(data={"numClasse":classe.numClasse,"numParcours":numParcours})
                return Response(ClasseSerializer(classe).data, status=status.HTTP_200_OK)
            return Response("Ce classe existe déjà !",status=status.HTTP_401_UNAUTHORIZED)
        else:
            serializer=ClasseSerializer(data=donneeClasse)
            if serializer.is_valid():
                classe=serializer.save()
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
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def put(self, request, numClasse):
        donnees=request.data
        numParcours=donnees.get('parcours')
        ancienParcours=donnees.get('ancienParcours')
        donneeClasse={
            "niveau":donnees.get('niveau'),
            "groupe":donnees.get('groupe')
        }
        try:
            classe=Classe.objects.get(pk=numClasse)
        except Classe.DoesNotExist:
            return Response({"erreur":"Classe introuvable !"}, status=status.HTTP_404_NOT_FOUND)
        
        if numParcours:
            parcours=Parcours.objects.filter(pk=numParcours).exists()
            if not parcours:
                return Response({"erreur":"Parcours introuvable !"}, status=status.HTTP_404_NOT_FOUND)
            classeParcours=classe.constituers.filter(numParcours=numParcours).exclude(numParcours=numParcours).exists()
            if classeParcours:
                return Response("Ce parcours est déjà liée par ce classe !")
            
            classeParcours=classe.constituers.filter(numParcours=ancienParcours).first()
            if classeParcours:
                if classeParcours.numParcours!=numParcours:
                    serializerConstitue=ConstituerSerializer(classeParcours,data={"numClasse":classe.numClasse,"numParcours":numParcours})
                    if serializerConstitue.is_valid():
                        serializerConstitue.save()
                    else:
                        return Response(serializerConstitue.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                serializerConstitue=ConstituerSerializer(data={"numClasse":classe.numClasse,"numParcours":numParcours})
                if serializerConstitue.is_valid():
                    serializerConstitue.save()
                else:
                    return Response(serializerConstitue.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer=ClasseSerializer(classe, data=donneeClasse)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, numClasse):
        try:
            classe=Classe.objects.get(pk=numClasse)
            classeParcours=classe.constituers.all()
            if len(classeParcours)<2:
                classe.delete()
            else:
                constitue=classe.constituers.filter(numClasse=numClasse).first()
                constitue.delete()
            return Response({'message':'Suppression avec succès !'}, status=status.HTTP_200_OK)
        except Classe.DoesNotExist:
            return Response({'erreur':'Classe introuvable'}, status=status.HTTP_404_NOT_FOUND)
