from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status
from django.core.mail import EmailMessage
from django.http import FileResponse
import random as rd
import pandas as pd
import os
from ..serializer.serializerExcel import ExcelSerializer
class EnvoyerMail:
    def envoyerMail(self, sujet, message, destinataire, pj=None):
        email=EmailMessage(
            subject=sujet,
            body=message,
            to=[destinataire]
        )
        if pj:
            email.attach(pj.name, pj.read(), pj.content_type)
        email.send()
class ExcelView(APIView):
    def post(self, request):
        serializer=ExcelSerializer(data=request.data)

        if serializer.is_valid():
            fichier=serializer.validated_data['fichier']
            try:
                df=pd.read_excel(fichier)
                data=df.to_dict(orient='records')

                return Response({"message":"Fichier traité avec succès !","data":df.iterrows()}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"erreur":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        chemin=os.path.join(settings.BASE_DIR,'edt','static','modele_excel','modele1.xlsx')

        if os.path.exists(chemin):
            response = FileResponse(open(chemin, 'rb'), as_attachment=True, filename='modele1.xlsx')
            response['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            response['Content-Disposition'] = 'attachment; filename="modele1.xlsx"'
            return response
        else:
            return Response({"error": "Fichier modèle non trouvé !"}, status=404)


class EmailView(APIView):
    def post(self, request):
        data=request.data
        pj=request.FILES.get('pj')
        mail=EnvoyerMail()
        mail.envoyerMail(data.get('sujet','Aucun sujet'),data['message'],data['destinataire'],pj)
        return Response({"message":data})

class MdpOublieView(APIView):
    def post(self, request):
        data=request.data
        sujet="Code de validation"
        code=str(rd.randint(0,999999)).zfill(6)
        message=f"Voiçi votre code de validation: {code}"
        EnvoyerMail.envoyerMail(sujet, message, data['destinataire'])
        return Response({"message":"Code de validation envoyé avec succès !"})

    