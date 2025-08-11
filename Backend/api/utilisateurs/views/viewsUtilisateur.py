from rest_framework_simplejwt.views import TokenObtainPairView
from ..serializers.serializerUtilisateur import InscriptionSerializer,ModifierUtilisateurSerializer,UtilisateurSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        serializer = UtilisateurSerializer(request.user, context={'request':request})
        return Response(serializer.data)

    def put(self, request):
        utilisateur = request.user
        serializer = ModifierUtilisateurSerializer(utilisateur, data=request.data, partial=True)
        if serializer.is_valid():
            user=serializer.save()
            serializerProfile = UtilisateurSerializer(user, context={'request':request})
            return Response(serializerProfile.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=400)
    
class InscriptionView(APIView):
    def post(self, request):
        data=request.data
        serializer = InscriptionSerializer(data=data)
        if serializer.is_valid():
            utilisateur = serializer.save()
            return Response(UtilisateurSerializer(utilisateur).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):    
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        password = request.data.get("password")

        user.set_password(password)
        user.save()
        return Response({"message": "Mot de passe modifié avec succès"},status=status.HTTP_200_OK)
    
class ChangeUsernameView(APIView):    
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        username = request.data.get("username")

        user.username=username
        user.save()

        return Response(UtilisateurSerializer(user,context={'request':request}).data,status=status.HTTP_200_OK)