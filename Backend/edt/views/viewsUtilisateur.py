from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from ..serializer.serializerUtilisateur import InscriptionSerializer,ConnexionSerializer

class InscriptionView(APIView):
    def post(self, request):
        serializer=InscriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Utilisateur enregistré avec succès !"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConnexionView(APIView):
    def post(self, request):
        serializer=ConnexionSerializer(data=request.data)
        if serializer.is_valid():
            username=serializer.validated_data['username']
            password=serializer.validated_data['password']
            utilisateur=authenticate(request, username=username, password=password)

            if utilisateur:
                login(request, utilisateur)
                token, created = Token.objects.get_or_create(user=utilisateur)
                return Response({
                    'message':'Connexion réussie !',
                    'token':token.key
                    }, status=  status.HTTP_200_OK)
            return Response({'erreur':'Identifiants invalid !'}, status=status.HTTP_401_UNAUTHORIZED)

class DeconnexionView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message':'Déconnexion réussie !'}, status=status.HTTP_200_OK)