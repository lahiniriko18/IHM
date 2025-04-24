from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerEdt import EdtSerializer
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