# Generated by Django 3.0.1 on 2021-01-02 07:40

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='code',
            field=models.CharField(default=api.models.generate_code, max_length=10, unique=True),
        ),
    ]
