from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from  django.http import JsonResponse
from ..models import Classe

@require_http_methods(["GET"])
def listClasse(request):
    classes=Classe.objects.all().values()
    return JsonResponse(list(classes), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def ajoutClasse(request):
    data=json.loads(request.body)
    classe=Classe.objects.create(
        niveau=data['niveau'],
        groupe=data['groupe']
    )
    return JsonResponse({
        'numClasse':classe.numClasse,
        'niveau':classe.niveau,
        'groupe':classe.groupe
    })

@csrf_exempt
@require_http_methods(["PUT"])
def modifClasse(request, numClasse):
    try:
        classe=Classe.objects.get(pk=numClasse)
        data=json.loads(request.body)

        classe.niveau=data['niveau']
        classe.groupe=data['groupe']
        classe.save()

        return JsonResponse({
            'numClasse':classe.numClasse,
            'niveau':classe.niveau,
            'groupe':classe.groupe
        })
    except classe.DoesNotExist:
        return JsonResponse({'erreur':'Classe introuvable'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def supprimeClasse(request, numClasse):
    try:
        classe=Classe.objects.get(pk=numClasse)
        classe.delete()
        return JsonResponse({'message':'Suppression avec succès'})
    except classe.DoesNotExist:
        return JsonResponse({'erreur':'Classe introuvable'}, status=404)