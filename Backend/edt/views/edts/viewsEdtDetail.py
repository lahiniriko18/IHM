from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...models import Edt
from ...serializer.serializerEdt import EdtSerializer


class EdtDetailView(APIView):
    def post(self, request):
        donnee=request.data
        numEdts=donnee.get('numEdts',[])
        if not isinstance(numEdts, list):
            numEdts=donnee.getlist('numEdts[]')

        if any(isinstance(numEdt, str) for numEdt in numEdts):
            return Response({"erreur":"Type de données invalide !"})
        
        edts=Edt.objects.filter(numEdt__in=numEdts)
        serializer=EdtSerializer(edts, many=True)
        return Response(serializer.data)