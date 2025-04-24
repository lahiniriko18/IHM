from django.urls import path
from ..views.viewsMention import MentionView

urlpatterns = [
    path('', MentionView.as_view(), name='mention'),
    path('ajouter/', MentionView.as_view(), name='mention.ajouter'),
    path('modifier/<int:numMention>', MentionView.as_view(), name='mention.modifier'),
    path('supprimer/<int:numMention>', MentionView.as_view(), name='mention.supprimer')
]