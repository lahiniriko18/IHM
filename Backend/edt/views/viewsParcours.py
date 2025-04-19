from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from  django.http import JsonResponse
from ..models import Parcours

@require_http_methods(["GET"])
def listParcours(request):
    parcours=Parcours.objects.all().values()
    return JsonResponse(list(parcours), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def ajoutParcours(request):
    data=json.loads(request.body)
    parcours=Parcours.objects.create(
        numMention=data['numMention'],
        nomParcours=data['nomParcours']
    )
    return JsonResponse({
        'numParcours':parcours.numParcours,
        'numMention':parcours.numMention,
        'nomParcours':parcours.nomParcours
    })

@csrf_exempt
@require_http_methods(["PUT"])
def modifParcours(request, numParcours):
    try:
        parcours=Parcours.objects.get(pk=numParcours)
        data=json.loads(request.body)

        parcours.numMention=data['numMention']
        parcours.nomParcours=data['nomParcours']
        parcours.save()

        return JsonResponse({
            'numParcours':parcours.numParcours,
            'numMention':parcours.numMention,
            'nomParcours':parcours.nomParcours
        })
    except parcours.DoesNotExist:
        return JsonResponse({'erreur':'Parcours introuvable'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def supprimeParcours(request, numParcours):
    try:
        parcours=Parcours.objects.get(pk=numParcours)
        parcours.delete()
        return JsonResponse({'message':'Suppression avec succès'})
    except parcours.DoesNotExist:
        return JsonResponse({'erreur':'Parcours introuvable'}, status=404)