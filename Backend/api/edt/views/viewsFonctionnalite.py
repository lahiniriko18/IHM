from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status
from django.core.mail import EmailMessage
import random as rd


class EnvoyerMail:
    def envoyerMail(self, sujet, message, destinataire, pj=None):
        email = EmailMessage(subject=sujet, body=message, to=[destinataire])
        if pj:
            email.attach(pj.name, pj.read(), pj.content_type)
        email.send()


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


class MdpOublieView(APIView):
    def post(self, request):
        data = request.data
        sujet = "Code de validation"
        code = str(rd.randint(0, 999999)).zfill(6)
        message = f"Voiçi votre code de validation: {code}"
        EnvoyerMail.envoyerMail(sujet, message, data["destinataire"])
        return Response({"message": "Code de validation envoyé avec succès !"})
