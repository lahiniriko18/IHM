from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerEdt import EdtSerializer
from ..serializer.serializerExcel import ExcelSerializer
import pandas as pd
from ..models import Edt
class EdtView(APIView):
    def get(self, request):
        edts=Edt.objects.all()
        serializer=EdtSerializer(edts, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer=EdtSerializer(data=request.data)
        if serializer.is_valid():
            edt=serializer.save()
            return Response(EdtSerializer(edt).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numEdt):
        try:
            edt=Edt.objects.get(pk=numEdt)
        except Edt.DoesNotExist:
            return Response({"erreur":"Emploi du temps introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=EdtSerializer(edt, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numEdt):
        try:
            edt=Edt.objects.get(pk=numEdt)
            edt.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Edt.DoesNotExist:
            return Response({'erreur':'Emploi du temps introuvable'}, status=status.HTTP_404_NOT_FOUND)
        
class EdtExcelView(APIView):
    def post(self, request):
        serializer=ExcelSerializer(data=request.data)

        if serializer.is_valid():
            fichier=serializer.validated_data['fichier']
            try:
                df=pd.read_excel(fichier, skiprows=3)
                premierLignes=pd.read_excel(fichier, nrows=2)
                df=df.fillna('vide')

                colonnes_requis=['Horaires','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
                jours=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
                
                premierLignes.columns=['Titre']

                nouveauColonnes=[]
                for i,col in enumerate(df.columns):
                    if i== 0 and "Unnamed" in col:
                        nouveauColonnes.append("Horaires")
                    else:
                        nouveauColonnes.append(col.strip())
                df.columns=nouveauColonnes
                if not all(col in df.columns for col in colonnes_requis):
                    return Response({"erreur":"Format invalide. Colonne requis: 'Horaires','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'"}, status=status.HTTP_400_BAD_REQUEST)
                
                data=[]
                colonnes=df.columns
                for i,ligne in df.iterrows():
                    lignes = {"Horaires":ligne['Horaires']}
                    if ligne['Horaires']!="vide":
                        j=1
                        while j<len(colonnes):
                            jour=colonnes[j]
                            valeurs=[ligne.get(jour)]
                            k=1
                            while j+k< len(colonnes) and colonnes[j+k] not in jours:
                                valeurs.append(ligne.get(colonnes[j+k]))
                                k+=1
                            j+=k
                            lignes[jour]=valeurs
                        data.append(lignes)

                return Response({"message":"Fichier traité avec succès !","data":colonnes}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"erreur":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
