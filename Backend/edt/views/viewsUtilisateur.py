from rest_framework.views import APIView
from django.conf import settings
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from ..serializer.serializerUtilisateur import InscriptionSerializer,ConnexionSerializer,UtilisateurSerializer
from ..models import Utilisateur
import os

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

class ProfileView(APIView):
    def get(self, request, id):
        try:
            utilisateur= Utilisateur.objects.get(pk=id)
            donnee=UtilisateurSerializer(utilisateur).data
            if donnee['image']:
                verifChemin=os.path.join(settings.MEDIA_ROOT, donnee['image'])
                if os.path.exists(verifChemin):
                    donnee['image']=request.build_absolute_uri(settings.MEDIA_URL + donnee['image'])
                else:
                    donnee['image']=''
            return Response(donnee,status=status.HTTP_200_OK)
        except Utilisateur.DoesNotExist:
            return Response({"erreur":"Utilisateur introuvable !"}, status=status.HTTP_404_NOT_FOUND)
        
        
    def put(self, request, id):
        try:
            utilisateur= Utilisateur.objects.get(pk=id)
        except Utilisateur.DoesNotExist:
            return Response({"erreur":"Utilisateur introuvable !"}, status=status.HTTP_404_NOT_FOUND)
        donnees=request.data
        image=donnees.get('image')
        if image:
            dossier=os.path.join(settings.MEDIA_ROOT, 'utilisateurs')
            os.makedirs(dossier, exist_ok=True)
            chemin_fichier = os.path.join(dossier, image.name)

            with open(chemin_fichier, 'wb+') as destination:
                for c in image.chunks():
                    destination.write(c)
            imageChemin=f"utilisateurs/{image.name}"
            donnees['image']=imageChemin
        serializer=InscriptionSerializer(utilisateur, data=donnees)

        if serializer.is_valid():
            serializer.save()
            donnee=serializer.data
            if donnee['image']:
                verifChemin=os.path.join(settings.MEDIA_ROOT, donnee['image'])
                if os.path.exists(verifChemin):
                    donnee['image']=request.build_absolute_uri(settings.MEDIA_URL + donnee['image'])
                else:
                    donnee['image']=''
            return Response(donnee, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
