from django.db import models

class EquipmentType(models.Model):
    name = models.CharField(max_length=100)

class EquipmentItem(models.Model):
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.CASCADE)
    comments = models.CharField(max_length=200)

class EquipmentRequest(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    # checkout_equipment = []
