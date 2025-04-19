from django.urls import path
from ..views import viewsMention

urlpatterns = [
    path('', viewsMention.listMention, name='mention'),
    path('ajouter/', viewsMention.ajoutMention, name='mention.ajouter'),
    path('modifier/<int:numMention>', viewsMention.modifMention, name='mention.modifier'),
    path('supprimer/<int:numMention>', viewsMention.supprimeMention, name='mention.supprimer')
]