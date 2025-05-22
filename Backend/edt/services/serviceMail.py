from rest_framework.views import APIView
from rest_framework import status
from datetime import timedelta,datetime
from ..models import Edt

class ServiceMailEdtProfesseur:
    def distriubuerMail(self, numEdts):
        professeurs=Edt.objects.filter(pk__in=numEdts).values_list('numProfesseur').distinct()
        print(professeurs)
        return "zah"
