from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerEtablissement import EtablissementSerializer
from ..models import Etablissement
import os


class EtablissementView(APIView):
    def get(self, request):
        etablissements=Etablissement.objects.all()
        serializer=EtablissementSerializer(etablissements, many=True)
        donnees=serializer.data
        for ligne in donnees:
            if ligne['logo']:
                verifChemin=os.path.join(settings.MEDIA_ROOT, ligne['logo'])
                if os.path.exists(verifChemin):
                    ligne['logo']=request.build_absolute_uri(settings.MEDIA_URL + ligne['logo'])
                else:
                    ligne['logo']=''
        return Response(donnees)


    def post(self, request):
        donnees=request.data
        logo=request.data.get('logo')
        if logo:
            dossier=os.path.join(settings.MEDIA_ROOT, 'etablissements')
            os.makedirs(dossier, exist_ok=True)
            chemin_fichier = os.path.join(dossier, logo.name)

            with open(chemin_fichier, 'wb+') as destination:
                for c in logo.chunks():
                    destination.write(c)
            logoChemin=f"etablissements/{logo.name}"
            donnees['logo']=logoChemin
        serializer=EtablissementSerializer(data=donnees)

        if serializer.is_valid():
            etablissement=serializer.save()
            donnee=EtablissementSerializer(etablissement).data
            if donnee['logo']:
                verifChemin=os.path.join(settings.MEDIA_ROOT, donnee['logo'])
                if os.path.exists(verifChemin):
                    donnee['logo']=request.build_absolute_uri(settings.MEDIA_URL + donnee['logo'])
                else:
                    donnee['logo']=''
            return Response(donnee, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

   
    def put(self, request, numEtablissement):
        try:
            etablissement = Etablissement.objects.get(pk=numEtablissement)
        except Etablissement.DoesNotExist:
            return Response({"erreur": "Etablissement introuvable"}, status=status.HTTP_404_NOT_FOUND)

        donnees = request.data.copy()
        ancienLogo=etablissement.logo
        nouveauLogo = request.FILES.get('logo')
        if not nouveauLogo:
            nouveauLogo=request.data.get('logo')
        logoChemin=ancienLogo
        if nouveauLogo:
            v=True
            if ancienLogo:
                absAncienLogo=request.build_absolute_uri(settings.MEDIA_URL + ancienLogo)
                v=(absAncienLogo!=nouveauLogo)
            if v:
                dossier = os.path.join(settings.MEDIA_ROOT, 'etablissements')
                os.makedirs(dossier, exist_ok=True)
                chemin_fichier = os.path.join(dossier, nouveauLogo.name)

                with open(chemin_fichier, 'wb+') as destination:
                    for c in nouveauLogo.chunks():
                        destination.write(c)
                logoChemin = f"etablissements/{nouveauLogo.name}"
        if ancienLogo and logoChemin!=ancienLogo:
            cheminAncienLogo=os.path.join(settings.MEDIA_ROOT, ancienLogo)
            existeAutre = Etablissement.objects.filter(logo=ancienLogo).exclude(pk=etablissement.numEtablissement).exists()
            if os.path.exists(cheminAncienLogo) and not existeAutre:
                os.remove(cheminAncienLogo)
        donnees['logo'] = logoChemin
        serializer = EtablissementSerializer(etablissement, data=donnees)
        if serializer.is_valid():
            etablissements = serializer.save()
            donnee = EtablissementSerializer(etablissements).data

            if donnee['logo']:
                verifChemin = os.path.join(settings.MEDIA_ROOT, donnee['logo'])
                if os.path.exists(verifChemin):
                    donnee['logo'] = request.build_absolute_uri(settings.MEDIA_URL + donnee['logo'])
                else:
                    donnee['logo'] = ''
            return Response(donnee, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        

    def delete(self, request, numEtablissement):
        try:
            etablissement= Etablissement.objects.get(pk=numEtablissement)
            logo=etablissement.logo
            if logo:
                cheminLogo=os.path.join(settings.MEDIA_ROOT, logo)
                existeAutre = Etablissement.objects.filter(logo=logo).exclude(pk=etablissement.numEtablissement).exists()
                if os.path.exists(cheminLogo) and not existeAutre:
                    os.remove(cheminLogo)
            etablissement.delete()
            return Response({"message":"Suppression avec succès !"}, status=status.HTTP_200_OK)
        except Etablissement.DoesNotExist:
            return Response({'erreur':'Etablissement introuvable !'}, status=status.HTTP_404_NOT_FOUND)
