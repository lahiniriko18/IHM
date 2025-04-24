from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializer.serializerMention import MentionSerializer
from ..models import Mention
class MentionView(APIView):
    def get(self, request):
        mentions=Mention.objects.all()
        serializer=MentionSerializer(mentions, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer=MentionSerializer(data=request.data)
        if serializer.is_valid():
            mention=serializer.save()
            return Response(MentionSerializer(mention).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, numMention):
        try:
            mention=Mention.objects.get(pk=numMention)
        except Mention.DoesNotExist:
            return Response({"erreur":"Mention introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer=MentionSerializer(mention, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, numMention):
        try:
            mention=Mention.objects.get(pk=numMention)
            mention.delete()
            return Response({'message':'Suppression avec succès'}, status=status.HTTP_200_OK)
        except Mention.DoesNotExist:
            return Response({'erreur':'Mention introuvable'}, status=status.HTTP_404_NOT_FOUND)