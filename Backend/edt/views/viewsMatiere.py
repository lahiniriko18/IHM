from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from  django.http import JsonResponse
from ..models import Matiere

@require_http_methods(["GET"])
def listMatiere(request):
    matieres=Matiere.objects.all().values()
    return JsonResponse(list(matieres), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def ajoutMatiere(request):
    data=json.loads(request.body)
    matiere=Matiere.objects.create(
        nomMatiere=data['nomMatiere']
    )
    return JsonResponse({
        'numMatiere':matiere.numMatiere,
        'nomMatiere':matiere.nomMatiere
    })

@csrf_exempt
@require_http_methods(["PUT"])
def modifMatiere(request, numMatiere):
    try:
        matiere=Matiere.objects.get(pk=numMatiere)
        data=json.loads(request.body)

        matiere.nomMatiere=data['nomMatiere']
        matiere.save()

        return JsonResponse({
            'numMatiere':Matiere.numMatiere,
            'nomMatiere':Matiere.nomMatiere
        })
    except Matiere.DoesNotExist:
        return JsonResponse({'erreur':'Matiere introuvable'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def supprimeMatiere(request, numMatiere):
    try:
        matiere=Matiere.objects.get(pk=numMatiere)
        matiere.delete()
        return JsonResponse({'message':'Suppression avec succès'})
    except matiere.DoesNotExist:
        return JsonResponse({'erreur':'Matiere introuvable'}, status=404)