# Generated by Django 3.0.3 on 2020-02-24 01:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EquipmentCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='EquipmentRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='EquipmentType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='linked_types', to='api.EquipmentCategory')),
            ],
        ),
        migrations.CreateModel(
            name='EquipmentItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comments', models.CharField(blank=True, max_length=200)),
                ('created_at', models.DateTimeField(editable=False)),
                ('image', models.ImageField(upload_to='')),
                ('description', models.CharField(blank=True, max_length=200)),
                ('equipment_type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='linked_items', to='api.EquipmentType')),
            ],
        ),
    ]
