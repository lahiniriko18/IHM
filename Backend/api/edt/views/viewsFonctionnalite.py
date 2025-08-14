from common.utils.email_utilis import EnvoyerMail
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class EmailView(APIView):
    def post(self, request):
        data = request.data
        pj = request.FILES.get("pj")
        mail = EnvoyerMail()
        mail.envoyerMail(
            data.get("sujet", "Aucun sujet"), data["message"], data["destinataire"], pj
        )
        return Response(
            {"message": "Email envoyé avec succès !"}, status=status.HTTP_200_OK
        )
