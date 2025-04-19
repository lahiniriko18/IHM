from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.http import JsonResponse
from ..models import Mention

@require_http_methods(["GET"])
def listMention(request):
    mentions=Mention.objects.all().values()
    return JsonResponse(list(mentions), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def ajoutMention(request):
    data=json.loads(request.body)
    mention=Mention.objects.create(
        numEtablissement=data['numEtablissement'],
        nomMention=data['nomMention']
    )
    return JsonResponse({
        'numMention':mention.numMention,
        'numEtablissement':mention.numEtablissement,
        'nomMention':mention.nomMention
    })

@csrf_exempt
@require_http_methods(["PUT"])
def modifMention(request, numMention):
    try:
        mention=Mention.objects.get(pk=numMention)
        data=json.loads(request.body)

        mention.numEtablissement=data['numEtablissement']
        mention.nomMention=data['nomMention']

        return JsonResponse({
            'numMention':mention.numMention,
            'numEtablissement':mention.numEtablissement,
            'nomMention':mention.nomMention,
        })
    except mention.DoesNotExist:
        return JsonResponse({'erreur':'Mention introuvable'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def supprimeMention(request, numMention):
    try:
        mention=Mention.objects.get(pk=numMention)
        mention.delete()
        return JsonResponse({'message':'Suppression avec succès'})
    except mention.DoesNotExist:
        return JsonResponse({'erreur':'Mention introuvable'}, status=404)