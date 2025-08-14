from rest_framework.response import Response
from rest_framework.views import APIView

from ...serializers.serializerModele import ModeleEdtSerializer
from ...services.serviceExcel import ServiceCreerExcel


class ModeleExcelView(APIView):
    def post(self, request):
        serializer = ModeleEdtSerializer(data=request.data)
        if serializer.is_valid():
            donnee = serializer.validated_data

            excelService = ServiceCreerExcel(
                donnee["nbCase"], donnee["titre1"], donnee["titre2"]
            )
            if donnee["typeFichier"] == 1:
                return excelService.modele1()
            else:
                return excelService.modele2()
        return Response(serializer.errors)
