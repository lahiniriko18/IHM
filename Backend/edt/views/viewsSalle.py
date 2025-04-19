from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from  django.http import JsonResponse
from ..models import Salle

@require_http_methods(["GET"])
def listSalle(request):
    salles=Salle.objects.all().values()
    return JsonResponse(list(salles), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def ajoutSalle(request):
    data=json.loads(request.body)
    salle=Salle.objects.create(
        nomSalle=data['nomSalle']
    )
    return JsonResponse({
        'numSalle':salle.numSalle,
        'nomSalle':salle.nomSalle
    })

@csrf_exempt
@require_http_methods(["PUT"])
def modifSalle(request, numSalle):
    try:
        salle=Salle.objects.get(pk=numSalle)
        data=json.loads(request.body)

        salle.nomSalle=data['nomSalle']
        salle.save()

        return JsonResponse({
            'numSalle':salle.numSalle,
            'nomSalle':salle.nomSalle
        })
    except Salle.DoesNotExist:
        return JsonResponse({'erreur':'Salle introuvable'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def supprimeSalle(request, numSalle):
    try:
        salle=Salle.objects.get(pk=numSalle)
        salle.delete()
        return JsonResponse({'message':'Suppression avec succès'})
    except salle.DoesNotExist:
        return JsonResponse({'erreur':'Salle introuvable'}, status=404)