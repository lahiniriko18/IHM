from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers.serializerAction import ActionSerializer
from ..models import Action


class ActionView(APIView):
    def get(self, request):
        actions = Action.objects.all().order_by("-numAction")
        serializer = ActionSerializer(actions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ActionSerializer(data=request.data)
        if serializer.is_valid():
            action = serializer.save()
            return Response(
                ActionSerializer(action).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, numAction):
        try:
            action = Action.objects.get(pk=numAction)
        except Action.DoesNotExist:
            return Response(
                {"erreur": "Action introuvable !"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = ActionSerializer(action, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, numAction):
        try:
            action = Action.objects.get(pk=numAction)
            action.delete()
            return Response(
                {"message": "Suppression avec succès !"}, status=status.HTTP_200_OK
            )
        except Action.DoesNotExist:
            return Response(
                {"erreur": "Action introuvable !"}, status=status.HTTP_404_NOT_FOUND
            )
