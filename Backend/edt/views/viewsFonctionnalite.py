from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.core.mail import send_mail
import json
import random as rd
from ..models import Professeur,Matiere,Parcours,Salle,Classe,Mention

def envoyerMail(sujet, message, destinataire, destinateur=None):
    send_mail(
        sujet,
        message,
        destinateur,
        [destinataire],
        fail_silently=False
    )
    return JsonResponse({'status':'Email envoyé avec succès'})


@csrf_exempt
@require_http_methods(["POST"])
def envoyerMailLibre(request):
    data=json.loads(request.body)
    return envoyerMail(data['sujet'], data['message'], data['destinataire'], data.get('destinateur'))


@csrf_exempt
@require_http_methods(["POST"])
def envoyerMailMdpOublie(request):
    data=json.loads(request.body)
    sujet="Code de validation"
    code=str(rd.randint(0,999999)).zfill(6)
    message=f"Voiçi votre code de validation: {code}"
    return envoyerMail(sujet, message, data['destinataire'], data.get('destinateur'))


@require_http_methods(["GET"])
def effectifTable(request):
    effectifs={
        "professeur":Professeur.objects.count(),
        "matiere":Matiere.objects.count(),
        "parcours":Parcours.objects.count(),
        "salle":Salle.objects.count(),
        "classe":Classe.objects.count(),
        "mention":Mention.objects.count()
    }
    return JsonResponse({"effectifs":effectifs})
    