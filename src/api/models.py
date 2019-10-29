from django.db import models
from django.utils import timezone


class EquipmentType(models.Model):
    name = models.CharField(max_length=100)

class EquipmentItem(models.Model):
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.CASCADE)
    comments = models.CharField(max_length=200)
    created_at = models.DateTimeField(editable=False)

    def save(self, *args, **kwargs):
        # Runs on first create (model will have id after its initial creation)
        if not self.id:
            self.created_at = timezone.now()
        # Let default save handler do its thing at the end
        return super(EquipmentItem, self).save(*args, **kwargs)


class EquipmentRequest(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    # checkout_equipment = []
