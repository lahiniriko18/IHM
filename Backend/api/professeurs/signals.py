from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import Professeur


@receiver(post_delete, sender=Professeur)
def auto_delete_image_on_delete(sender, instance, **kwargs):
    if instance.photos:
        instance.photos.delete(save=False)


@receiver(pre_save, sender=Professeur)
def auto_delete_image_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        ancienImage = Professeur.objects.get(pk=instance.pk).photos
    except Professeur.DoesNotExist:
        return False

    nouveauImage = instance.photos
    if ancienImage and ancienImage != nouveauImage:
        ancienImage.delete(save=False)
