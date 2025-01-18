from django.db.models.signals import post_save
from django.dispatch import receiver

from drive.models import Drive

from .models import User


@receiver(post_save, sender=User)
def create_default_drive(sender, instance, created, **kwargs):
    if created:
        users_first_name = instance.name.split(" ")[0]
        Drive.objects.create(name=f"{users_first_name}'s Drive", owner=instance)
