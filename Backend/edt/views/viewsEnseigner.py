from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from  django.http import JsonResponse
from ..models import Enseigner

@require_http_methods(["GET"])
def listEnseigner(request):
    enseigners=Enseigner.objects.all().values()
    return JsonResponse(list(enseigners), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def ajoutEnseigner(request):
    data=json.loads(request.body)
    enseigner=Enseigner.objects.create(
        numProfesseur=data['numProfesseur'],
        numMatiere=data['numMatiere']
    )
    return JsonResponse({
        'numEnseigner':enseigner.numEnseigner,
        'numProfesseur':enseigner.numProfesseur,
        'numMatiere':enseigner.numMatiere
    })

@csrf_exempt
@require_http_methods(["PUT"])
def modifEnseigner(request, numEnseigner):
    try:
        enseigner=Enseigner.objects.get(pk=numEnseigner)
        data=json.loads(request.body)

        enseigner.numProfesseur=data['numProfesseur']
        enseigner.numMatiere=data['numMatiere']
        enseigner.save()

        return JsonResponse({
            'numEnseigner':enseigner.numEnseigner,
            'numProfesseur':enseigner.numProfesseur,
            'numMatiere':enseigner.numMatiere
        })
    except Enseigner.DoesNotExist:
        return JsonResponse({'erreur':'Enseigner introuvable'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def supprimeEnseigner(request, numEnseigner):
    try:
        enseigner=Enseigner.objects.get(pk=numEnseigner)
        enseigner.delete()
        return JsonResponse({'message':'Suppression avec succès'})
    except enseigner.DoesNotExist:
        return JsonResponse({'erreur':'Enseigner introuvable'}, status=404)