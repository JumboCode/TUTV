from django.db import models

class Equipment_type(models.Model):
    name = models.CharField(max_length=100)

class Equipment_item(models.Model):
    equipment_type = models.ForeignKey(Equipment_type, on_delete=models.CASCADE)


