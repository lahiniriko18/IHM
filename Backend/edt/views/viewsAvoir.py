from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from  django.http import JsonResponse
from ..models import Avoir

@require_http_methods(["GET"])
def listAvoir(request):
    avoirs=Avoir.objects.all().values()
    return JsonResponse(list(avoirs), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def ajoutAvoir(request):
    data=json.loads(request.body)
    avoir=Avoir.objects.create(
        numEdt=data['numEdt'],
        numEtablissement=data['numEtablissement']
    )
    return JsonResponse({
        'numAvoir':avoir.numAvoir,
        'numEdt':avoir.numEdt,
        'numEtablissement':avoir.numEtablissement
    })

@csrf_exempt
@require_http_methods(["PUT"])
def modifAvoir(request, numAvoir):
    try:
        avoir=Avoir.objects.get(pk=numAvoir)
        data=json.loads(request.body)

        avoir.numEdt=data['numEdt']
        avoir.numEtablissement=data['numEtablissement']
        avoir.save()

        return JsonResponse({
            'numAvoir':avoir.numAvoir,
            'numEdt':avoir.numEdt,
            'numEtablissement':avoir.numEtablissement
        })
    except avoir.DoesNotExist:
        return JsonResponse({'erreur':'Avoir edt introuvable'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def supprimeAvoir(request, numAvoir):
    try:
        avoir=Avoir.objects.get(pk=numAvoir)
        avoir.delete()
        return JsonResponse({'message':'Suppression avec succès'})
    except avoir.DoesNotExist:
        return JsonResponse({'erreur':'Avoir edt introuvable'}, status=404)