# Generated by Django 3.2.7 on 2021-12-24 20:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20211224_2016'),
    ]

    operations = [
        migrations.AlterField(
            model_name='equipmentinstance',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='equipmentrequest',
            name='equipment_instances',
            field=models.ManyToManyField(blank=True, related_name='linked_requests', to='api.EquipmentInstance'),
        ),
    ]
