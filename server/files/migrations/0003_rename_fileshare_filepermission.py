# Generated by Django 5.1.4 on 2025-01-15 19:00

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0002_rename_can_write_fileshare_can_download'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name='FileShare',
            new_name='FilePermission',
        ),
    ]
