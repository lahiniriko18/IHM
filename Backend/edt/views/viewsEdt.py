from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.http import JsonResponse
from ..models import Edt

@require_http_methods(["GET"])
def listEdt(request):
    edts=Edt.objects.all().values()
    return JsonResponse(list(edts), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def ajoutEdt(request):
    data=json.loads(request.body)
    edt=Edt.objects.create(
        numMatiere=data['numMatiere'],
        numParcours=data['numParcours'],
        numSalle=data['numSalle'],
        numClasse=data['numClasse'],
        date=data['date'],
        heureDebut=data['heureDebut'],
        heureFin=data['heureFin']
    )
    return JsonResponse({
        'numEdt':edt.numEdt,
        'numMatiere':edt.numMatiere,
        'numParcours':edt.numParcours,
        'numSalle':edt.numSalle,
        'numClasse':edt.numClasse,
        'date':edt.date,
        'heureDebut':edt.heureDebut,
        'heureFin':edt.heureFin
    })

@csrf_exempt
@require_http_methods(["PUT"])
def modifEdt(request, numEdt):
    try:
        edt=Edt.objects.get(pk=numEdt)
        data=json.loads(request.body)

        edt.numMatiere=data['numMatiere']
        edt.numParcours=data['numParcours']
        edt.numSalle=data['numSalle']
        edt.numClasse=data['numClasse']
        edt.date=data['date']
        edt.heureDebut=data['heureDebut']
        edt.heureFin=data['heureFin']
        edt.save()

        return JsonResponse({
            'numEdt':edt.numEdt,
            'numMatiere':edt.numMatiere,
            'numParcours':edt.numParcours,
            'numSalle':edt.numSalle,
            'numClasse':edt.numClasse,
            'date':edt.date,
            'heureDebut':edt.heureDebut,
            'heureFin':edt.heureFin
        })
    except edt.DoesNotExist:
         return JsonResponse({'erreur':'Emploi du temps introuvable'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def supprimeEdt(request, numEdt):
    try:
        edt=Edt.objects.get(pk=numEdt)
        edt.delete()
        return JsonResponse({'message':'Suppression avec succès'})
    except edt.DoesNotExist:
        return JsonResponse({'erreur':'Emploi du temps introuvable'}, status=404)