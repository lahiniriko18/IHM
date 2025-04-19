from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.http import JsonResponse
from ..models import Etablissement

@require_http_methods(["GET"])
def listEtablissement(request):
    etablissements=Etablissement.objects.all().values()
    return JsonResponse(list(etablissements), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def ajoutEtablissement(request):
    data=json.loads(request.body)
    etablissement=Etablissement.objects.create(
        nomEtablissement=data['nomEtablissement'],
        adresse=data['adresse'],
        email=data['email'],
        slogant=data['slogant'],
        logo=data['logo'],
        contact=data['contact']
    )
    return JsonResponse({
        'numEtablissement':etablissement.numEtablissement,
        'nomEtablissement':etablissement.nomEtablissement,
        'adresse':etablissement.adresse,
        'email':etablissement.email,
        'slogant':etablissement.slogant,
        'logo':etablissement.logo,
        'contact':etablissement.contact
    })

@csrf_exempt
@require_http_methods(["PUT"])
def modifEtablissement(request, numEtablissement):
    try:
        etablissement=Etablissement.objects.get(pk=numEtablissement)
        data=json.loads(request.body)

        etablissement.nomEtablissement=data['nomEtablissement']
        etablissement.adresse=data['adresse']
        etablissement.email=data['email']
        etablissement.slogant=data['slogant']
        etablissement.logo=data['logo']
        etablissement.contact=data['contact']
        etablissement.save()

        return JsonResponse({
            'numEtablissement':etablissement.numEtablissement,
            'nomEtablissement':etablissement.nomEtablissement,
            'adresse':etablissement.adresse,
            'email':etablissement.email,
            'slogant':etablissement.slogant,
            'logo':etablissement.logo,
            'contact':etablissement.contact
        })
    except etablissement.DoesNotExist:
         return JsonResponse({'erreur':'Etablissement introuvable'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def supprimeEtablissement(request, numEtablissement):
    try:
        etablissement=Etablissement.objects.get(pk=numEtablissement)
        etablissement.delete()
        return JsonResponse({'message':'Suppression avec succès'})
    except etablissement.DoesNotExist:
        return JsonResponse({'erreur':'Etablissement introuvable'}, status=404)