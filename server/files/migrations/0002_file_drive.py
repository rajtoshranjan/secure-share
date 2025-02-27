# Generated by Django 5.1.4 on 2025-01-17 04:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("drive", "0001_initial"),
        ("files", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="file",
            name="drive",
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="files",
                to="drive.drive",
            ),
            preserve_default=False,
        ),
    ]
