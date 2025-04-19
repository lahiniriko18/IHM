from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.http import JsonResponse
from ..models import Professeur

@require_http_methods(["GET"])
def listProfesseur(request):
    professeurs=Professeur.objects.all().values()
    return JsonResponse(list(professeurs), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def ajoutProfesseur(request):
    data=json.loads(request.body)
    professeur=Professeur.objects.create(
        numEtablissement=data['numEtablissement'],
        nomProfesseur=data['nomProfesseur'],
        prenomProfesseur=data['prenomProfesseur'],
        grade=data['grade'],
        sexe=data['sexe'],
        adresse=data['adresse'],
        contact=data['contact'],
        description=data['description']
    )
    return JsonResponse({
        'numProfesseur':professeur.numProfesseur,
        'numEtablissement':professeur.numEtablissement,
        'nomProfesseur':professeur.nomProfesseur,
        'prenomProfesseur':professeur.prenomProfesseur,
        'grade':professeur.grade,
        'sexe':professeur.sexe,
        'sexe':professeur.adresse,
        'contact':professeur.contact,
        'description':professeur.description,
    })

@csrf_exempt
@require_http_methods(["PUT"])
def modifProfesseur(request, numProfesseur):
    try:
        professeur=Professeur.objects.get(pk=numProfesseur)
        data=json.loads(request.body)

        professeur.numEtablissement=data['numEtablissement']
        professeur.nomProfesseur=data['nomProfesseur']
        professeur.prenomProfesseur=data['prenomProfesseur']
        professeur.grade=data['grade']
        professeur.sexe=data['sexe']
        professeur.contact=data['contact']
        professeur.description=data['description']
        professeur.save()

        return JsonResponse({
            'numProfesseur':professeur.numProfesseur,
            'numEtablissement':professeur.numEtablissement,
            'nomProfesseur':professeur.nomProfesseur,
            'prenomProfesseur':professeur.prenomProfesseur,
            'grade':professeur.grade,
            'sexe':professeur.sexe,
            'sexe':professeur.adresse,
            'contact':professeur.contact,
            'description':professeur.description,
        })
    except professeur.DoesNotExist:
        return JsonResponse({'erreur':'Professeur introuvable'}, status=404)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def supprimeProfesseur(request, numProfesseur):
    try:
        professeur=Professeur.objects.get(pk=numProfesseur)
        professeur.delete()
        return JsonResponse({'message':'Suppression avec succès'})
    except professeur.DoesNotExist:
        return JsonResponse({'erreur':'Professeur introuvable'}, status=404)