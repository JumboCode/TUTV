from django.db import models
from django.utils import timezone

'''
ENCAPSULATION OF MODELS:
     CATEGORY --> TYPE --> ITEM 
'''

class EquipmentCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return 'Category: ' + self.name
    def types(self):
        return self.linked_types.all

class EquipmentType(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(EquipmentCategory, on_delete=models.CASCADE, related_name='linked_types')

    def __str__(self):
        return 'Equipment Type: ' + self.name
    def items(self):
        return self.linked_items.all()
    def num_items(self):
        return len(self.linked_items.all())


class EquipmentItem(models.Model):
    # id_of_type = models.IntegerField()
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.CASCADE, related_name='linked_items', null=True) # Need the null=True here
    comments = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(editable=False)

    def __str__(self):
        return 'Equipment Item: ' + self.equipment_type.name + ' #' + str(self.id) + ' of ' + str(self.equipment_type.num_items())# Need fixing

    def save(self, *args, **kwargs):
        # Runs on first create (model will have id after its initial creation)
        if not self.id:
            self.created_at = timezone.now()
            # self.id_of_type = self.equipment_type.num_items()
        # Let default save handler do its thing at the end
        return super(EquipmentItem, self).save(*args, **kwargs)


class EquipmentRequest(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    # checkout_equipment = []