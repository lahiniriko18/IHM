# Generated by Django 5.0.1 on 2025-04-24 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('edt', '0004_professeur_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='professeur',
            name='sexe',
            field=models.CharField(max_length=8),
        ),
    ]
