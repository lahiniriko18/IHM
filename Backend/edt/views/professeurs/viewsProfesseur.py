from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from ...serializer.serializerProfesseur import ProfesseurSerializer
from ...serializer.serializerEnseigner import EnseignerSerializer
from ...models import Professeur
import os
class ProfesseurView(APIView):
    def get(self, request):
        professeurs=Professeur.objects.all().order_by('-numProfesseur')
        serializer=ProfesseurSerializer(professeurs, many=True)
        donnees=serializer.data
        for ligne in donnees:
            if ligne['photos']:
                verifChemin=os.path.join(settings.MEDIA_ROOT, ligne['photos'])
                if os.path.exists(verifChemin):
                    ligne['photos']=request.build_absolute_uri(settings.MEDIA_URL + ligne['photos'])
                else:
                    ligne['photos']=''
        return Response(donnees, status=status.HTTP_200_OK)
    
    def post(self, request):
        donnees=request.data
        photos=request.data.get('photos')
        numMatieres=donnees.get('matieres')
        if  not isinstance(numMatieres, list):
            numMatieres=donnees.getlist('matieres[]')
        if photos:
            dossier=os.path.join(settings.MEDIA_ROOT, 'professeurs')
            os.makedirs(dossier, exist_ok=True)
            cheminFichier = os.path.join(dossier, photos.name)

            with open(cheminFichier, 'wb+') as destination:
                for c in photos.chunks():
                    destination.write(c)
            photosChemin=f"professeurs/{photos.name}"
            donnees['photos']=photosChemin
        serializer=ProfesseurSerializer(data=donnees)
        if serializer.is_valid():
            professeur=serializer.save()
            donnee=ProfesseurSerializer(professeur).data
            if donnee['photos']:
                verifChemin=os.path.join(settings.MEDIA_ROOT, donnee['photos'])
                
                if os.path.exists(verifChemin):
                    donnee['photos']=request.build_absolute_uri(settings.MEDIA_URL + donnee['photos'])
                else:
                    donnee['photos']=''
            if isinstance(numMatieres, list):
                if len(numMatieres) > 0:
                    donneeEns=[]
                    for numMatiere in numMatieres:
                        donneeEns.append({
                            "numProfesseur":professeur.numProfesseur,
                            "numMatiere":numMatiere
                        })
                    serializerEns=EnseignerSerializer(data=donneeEns, many=True)
                    if serializerEns.is_valid():
                        serializerEns.save()
                    else:
                        return Response(serializerEns.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"erreur":"Type de données du matière invalide !"}, status=status.HTTP_401_UNAUTHORIZED)
            return Response(donnee, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, numProfesseur):
        try:
            professeur=Professeur.objects.get(pk=numProfesseur)
        except Professeur.DoesNotExist:
            return Response({"erreur":"Professeur introuvable !"}, status=status.HTTP_404_NOT_FOUND)
        
        donnees = request.data.copy()
        ancienPhotos=professeur.photos
        nouveauPhotos = request.FILES.get('photos')
        photosChemin=''

        numMatieres=donnees.get('matieres')
        if not isinstance(numMatieres, list):
            numMatieres=donnees.getlist('matieres[]')
        numMatieres=list(map(int, numMatieres))
        if not nouveauPhotos:
            nouveauPhotos=request.data.get('photos')
        if nouveauPhotos:
            v=True
            if ancienPhotos:
                absAncienPhotos=request.build_absolute_uri(settings.MEDIA_URL + ancienPhotos)
                v=(absAncienPhotos!=nouveauPhotos)
            if v:
                dossier = os.path.join(settings.MEDIA_ROOT, 'professeurs')
                os.makedirs(dossier, exist_ok=True)
                chemin_fichier = os.path.join(dossier, nouveauPhotos.name)

                with open(chemin_fichier, 'wb+') as destination:
                    for c in nouveauPhotos.chunks():
                        destination.write(c)
                photosChemin = f"professeurs/{nouveauPhotos.name}"
            else:
                photosChemin = ancienPhotos
        if ancienPhotos and photosChemin!=ancienPhotos:
            cheminAncienPhotos=os.path.join(settings.MEDIA_ROOT, ancienPhotos)
            existeAutre = Professeur.objects.filter(photos=ancienPhotos).exclude(pk=professeur.numProfesseur).exists()
            if os.path.exists(cheminAncienPhotos) and not existeAutre:
                os.remove(cheminAncienPhotos)
        donnees['photos'] = photosChemin
        serializer=ProfesseurSerializer(professeur, data=donnees)
        if serializer.is_valid():
            prof=serializer.save()
            donnee = ProfesseurSerializer(prof).data
            
            if donnee['photos']:
                verifChemin = os.path.join(settings.MEDIA_ROOT, donnee['photos'])
                if os.path.exists(verifChemin):
                    donnee['photos'] = request.build_absolute_uri(settings.MEDIA_URL + donnee['photos'])
                else:
                    donnee['photos'] = ''

            if isinstance(numMatieres, list):
                enseigners=prof.enseigners.filter()
                dataEns=EnseignerSerializer(enseigners, many=True).data
                matiereEns=[ens['numMatiere'] for ens in dataEns]
                donneeEns=[]
                for numMatiere in numMatieres:
                    if numMatiere not in matiereEns:
                        donneeEns.append({
                            "numProfesseur":prof.numProfesseur,
                            "numMatiere":numMatiere
                        })
                if sorted(matiereEns) != sorted(numMatieres):
                    for ens in enseigners:
                        if ens.numMatiere.numMatiere not in numMatieres:
                            ens.delete()
                if len(donneeEns) > 0:
                    serializerEns=EnseignerSerializer(data=donneeEns, many=True)
                    if serializerEns.is_valid():
                        serializerEns.save()
                    else:
                        return Response(serializerEns.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"erreur":"Type de données du matière invalide !"}, status=status.HTTP_401_UNAUTHORIZED)
            return Response(donnee, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, request, numProfesseur):
        try:
            professeur=Professeur.objects.get(pk=numProfesseur)
            photos=professeur.photos
            if photos:
                cheminPhotos=os.path.join(settings.MEDIA_ROOT, photos)
                existeAutre = Professeur.objects.filter(photos=photos).exclude(pk=professeur.numProfesseur).exists()
                if os.path.exists(cheminPhotos) and not existeAutre:
                    os.remove(cheminPhotos)
            professeur.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except professeur.DoesNotExist:
            return Response({'erreur':'Professeur introuvable !'}, status=status.HTTP_404_NOT_FOUND)