# Generated by Django 5.1.2 on 2024-12-16 01:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('marketplace', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='user_lat',
        ),
        migrations.RemoveField(
            model_name='post',
            name='user_long',
        ),
        migrations.AddField(
            model_name='post',
            name='created_by',
            field=models.CharField(default='Anonymous', max_length=150),
        ),
        migrations.AddField(
            model_name='post',
            name='user_location',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
