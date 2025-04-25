from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
import json
import random as rd
from ..models import Professeur,Matiere,Parcours,Salle,Classe,Mention,Edt,Groupe,Action

class EffectifView(APIView):
    def get(self, request):
        effectifs={
            "professeur":Professeur.objects.count(),
            "matiere":Matiere.objects.count(),
            "parcours":Parcours.objects.count(),
            "salle":Salle.objects.count(),
            "classe":Classe.objects.count(),
            "mention":Mention.objects.count(),
            "edt":Edt.objects.count(),
            "groupe":Groupe.objects.count(),
            "action":Action.objects.count()
        }
        return Response({"effectifs":effectifs})

class EnvoyerMail:
    def envoyerMail(self, sujet, message, destinataire, destinateur=None):
        send_mail(
            sujet,
            message,
            destinateur,
            [destinataire],
            fail_silently=True
        )
class EmailView(APIView):
    def post(self, request):
        data=request.data
        EnvoyerMail.envoyerMail(data['sujet'], data['message'], data['destinataire'], data.get('destinateur'))
        return Response({"message":data})

class MdpOublieView(APIView):
    def post(self, request):
        data=json.loads(request.body)
        sujet="Code de validation"
        code=str(rd.randint(0,999999)).zfill(6)
        message=f"Voiçi votre code de validation: {code}"
        EnvoyerMail.envoyerMail(sujet, message, data['destinataire'], data.get('destinateur'))
        return Response({"message":"Code de validation envoyé avec succès !"})

    