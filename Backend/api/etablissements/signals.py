from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import Etablissement


@receiver(post_delete, sender=Etablissement)
def auto_delete_image_on_delete(sender, instance, **kwargs):
    if instance.logo:
        instance.logo.delete(save=False)


@receiver(pre_save, sender=Etablissement)
def auto_delete_image_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        ancienImage = Etablissement.objects.get(pk=instance.pk).logo
    except Etablissement.DoesNotExist:
        return False

    nouveauImage = instance.logo
    if ancienImage and ancienImage != nouveauImage:
        ancienImage.delete(save=False)
