from django.db import models
from django.utils import timezone


#### ENCAPSULATION OF MODELS:
####     CATEGORY --> TYPE --> ITEM 
#### 

class EquipmentCategory(models.Model):
    name = models.CharField(max_length=100)

    def types(self):
        return self.linked_types.all

class EquipmentType(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(EquipmentCategory, default="", on_delete=models.CASCADE, related_name='linked_types')

    def items(self):
        return self.linked_items.all()


class EquipmentItem(models.Model):
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.CASCADE, related_name='linked_items')
    comments = models.CharField(max_length=200, blank=True)
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
