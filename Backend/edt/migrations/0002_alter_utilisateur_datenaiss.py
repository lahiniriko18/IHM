# Generated by Django 5.0.1 on 2025-04-21 19:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('edt', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='utilisateur',
            name='datenaiss',
            field=models.DateField(null=True),
        ),
    ]
