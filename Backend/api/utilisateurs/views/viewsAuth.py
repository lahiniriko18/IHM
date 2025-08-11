from rest_framework_simplejwt.views import TokenObtainPairView
from ..serializers.serializerAuth import ConnexionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken

class ConnexionView(TokenObtainPairView):
    serializer_class = ConnexionSerializer

class DeconnexionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Déconnexion réussie."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Token invalide ou manquant"}, status=status.HTTP_400_BAD_REQUEST)

class VerifyPassword(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user=request.user
        currentPassword=request.data.get("password")
        if not user.check_password(currentPassword):
            return Response({'error': 'Mot de passe incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Mot de passe correct.'}, status=status.HTTP_200_OK)