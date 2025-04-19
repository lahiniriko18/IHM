from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.core.mail import send_mail
import json

@csrf_exempt
@require_http_methods(["POST"])
def envoyerMail(request):
    data=json.loads(request.body)
    sujet=data.get('sujet')
    message=data.get('message')
    destinataire=data.get('destinataire')

    send_mail(
        sujet,
        message,
        'lahinirikonatolotriniavojeremi@gmail.com',
        [destinataire],
        fail_silently=False
    )
    return JsonResponse({'status':'Email envoyé avec succès'})