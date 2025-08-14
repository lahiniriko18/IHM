import random as rd

from common.utils.email_utilis import EnvoyerMail
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


class ValidationCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        code = str(rd.randint(0, 999999)).zfill(6)
        sujet = "Code de validation"
        message = f"Voici votre code de validation : {code}"
        mail = EnvoyerMail()
        mail.envoyerMail(sujet, message, user.email)
        return Response(
            {"message": "Code de validation envoyé avec succès !", "code": code},
            status=status.HTTP_200_OK,
        )
