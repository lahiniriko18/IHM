from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerUtilisateur import InscriptionSerializer

class InscriptionView(APIView):
    def post(self, request):
        serializer=InscriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Utilisateur enregistré avec succès !"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
