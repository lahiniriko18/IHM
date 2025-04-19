from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from  django.http import JsonResponse
from ..models import Constituer

@require_http_methods(["GET"])
def listConstituer(request):
    constituers=Constituer.objects.all().values()
    return JsonResponse(list(constituers), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def ajoutConstituer(request):
    data=json.loads(request.body)
    constituer=Constituer.objects.create(
        numParcours=data['numParcours'],
        numClasse=data['numClasse']
    )
    return JsonResponse({
        'numConstituer':constituer.numConstituer,
        'numParcours':constituer.numParcours,
        'numClasse':constituer.numClasse
    })

@csrf_exempt
@require_http_methods(["PUT"])
def modifConstituer(request, numConstituer):
    try:
        constituer=Constituer.objects.get(pk=numConstituer)
        data=json.loads(request.body)

        constituer.numParcours=data['numParcours']
        constituer.numClasse=data['numClasse']
        constituer.save()

        return JsonResponse({
            'numConstituer':constituer.numConstituer,
            'numParcours':constituer.numParcours,
            'numClasse':constituer.numClasse
        })
    except Constituer.DoesNotExist:
        return JsonResponse({'erreur':'Constituer introuvable'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def supprimeConstituer(request, numConstituer):
    try:
        constituer=Constituer.objects.get(pk=numConstituer)
        constituer.delete()
        return JsonResponse({'message':'Suppression avec succès'})
    except constituer.DoesNotExist:
        return JsonResponse({'erreur':'Constituer introuvable'}, status=404)