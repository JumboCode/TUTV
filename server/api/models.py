from django.db import models
from django.utils import timezone

"""
ENCAPSULATION OF MODELS:
    CATEGORY --> TYPE --> ITEM
Current TUTV Equipment Spreadsheet: https://docs.google.com/spreadsheets/d/1Ri8P4sk1lA8u91ScwbwDOBavVhIY5mwKdQhH-MFlk-E/edit#gid=0
"""

class EquipmentCategory(models.Model):
    """
    Categories of equipments such as Camera, Lens, Accessories, etc.
    """
    name = models.CharField(max_length=100)

    def __str__(self):
        return f'Category: {self.name}'
    def types(self):
        return self.linked_types.all


class EquipmentType(models.Model):
    """
    Equipment Categories contain Equipment Types, such as Canon T3i (under
    category camera) or Canon 85 mm lens (under category lens)
    """
    name = models.CharField(max_length=100)
    category = models.ForeignKey(EquipmentCategory, on_delete=models.CASCADE, related_name='linked_types')

    image = models.ImageField(upload_to='') # is the upload_to attribute correct?
    description = models.CharField(max_length=200, blank=True)
    product_url = models.URLField(blank=True)

    def __str__(self):
        return f'Equipment Type: {self.name}'
    def items(self):
        return self.linked_items.all()
    def num_items(self):
        return len(self.linked_items.all())


class EquipmentItem(models.Model):
    """
    Equipment Types contain Equipment Items, such as Canon T3i #1, #2, #3,
    etc. (under Canon T3i)
    """
    id_of_type = models.IntegerField(null=True)
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.CASCADE, related_name='linked_items', null=True) # Need the null=True here
    comments = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(editable=False)

    def __str__(self):
        if hasattr(self.equipment_type, 'name'):
            return f'Equipment Item: {self.equipment_type.name} #{self.id_of_type} of {self.equipment_type.num_items()}' # Need fixing
        else:
            return f'Equipment Item: null equipment type name #{self.id_of_type}'

    def save(self, *args, **kwargs):
        # Runs on first create (model will have id after its initial creation)
        if not self.id:
            self.created_at = timezone.now()
            # self.id_of_type = self.equipment_type.num_items()
        # Let default save handler do its thing at the end
        return super(EquipmentItem, self).save(*args, **kwargs)
    
    def is_available(self, request_out, request_in): # TODO: needs testing
        for request in self.linked_requests.all():
            if (request_out < request.request_out) or (request_in > request.request_in):
                return False
        return True


class EquipmentRequest(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    request_out = models.DateTimeField(blank=True)
    request_in = models.DateTimeField(blank=True)
    equipment_item = models.ForeignKey(EquipmentItem, on_delete=models.CASCADE, related_name='linked_requests', null=True)
    # user = # TODO
