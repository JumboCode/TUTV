from django.db import models
from django.utils import timezone

from django.contrib.auth.models import User

"""
ENCAPSULATION OF MODELS:
    CATEGORY --> TYPE --> ITEM --> INSTANCE
Current TUTV Equipment Spreadsheet: https://docs.google.com/spreadsheets/d/1Ri8P4sk1lA8u91ScwbwDOBavVhIY5mwKdQhH-MFlk-E/edit#gid=0
"""


class EquipmentCategory(models.Model):
    """
    Broad category of an equipment.
    E.g. "Camera", "Lenses", "Audio", etc.
    """

    name = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.name


class EquipmentType(models.Model):
    """
    Type of equipment within a category.
    E.g. within "Lighting", there are "Stands", "Clamps", "Lights", etc.
    """

    name = models.CharField(max_length=100)
    description = models.TextField()
    equipment_category_FK = models.ForeignKey(
        EquipmentCategory, on_delete=models.CASCADE, related_name="linked_types"
    )

    def __str__(self):
        return self.name

    def __str__(self):
        return f"Category: {self.name}"

    def items(self):
        return self.linked_items.all


class EquipmentItem(models.Model):
    """
    A purchasable piece of equipment (there could be multiple of the same
    item, which are represented as EquipmentInstance objects).
    E.g. within category "Lighting" and type "Lights", there are "LEDs" and
    "Kinos", etc.
    """

    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True)
    equipment_type_FK = models.ForeignKey(
        EquipmentType, on_delete=models.CASCADE, related_name="linked_items"
    )

    # is the upload_to attribute correct?
    image = models.ImageField(upload_to="", null=True)
    product_url = models.URLField(blank=True)

    def __str__(self):
        return f"Equipment Type: {self.name}"

    def instances(self):
        return self.linked_instances.all()

    def num_items(self):
        return len(self.linked_instances.all())


class EquipmentInstance(models.Model):
    """
    The specific instance of a piece of equipment item.
    E.g. within "Lighting -> Lights -> LED", there are "LED #1", "LED #2",
    etc.
    """

    equipment_item_FK = models.ForeignKey(
        EquipmentItem,
        on_delete=models.CASCADE,
        related_name="linked_instances",
        null=True,
    )  # Need the null=True heres
    id_of_item = models.IntegerField(null=True)
    comments = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(editable=False)

    def __str__(self):
        if hasattr(self.equipment_item_FK, "name"):
            return f"Equipment Item: {self.equipment_item_FK.name} #{self.id_of_item} of {self.equipment_item_FK.num_items()}"  # Need fixing
        else:
            return f"Equipment Item: null equipment type name #{self.id_of_item}"

    def save(self, *args, **kwargs):
        # Runs on first create (model will have id after its initial creation)
        if not self.id:
            self.created_at = timezone.now()
            # self.id_of_type = self.equipment_type.num_items()
        # Let default save handler do its thing at the end
        return super(EquipmentInstance, self).save(*args, **kwargs)

    def assoc_requests(self):
        return self.linked_requests.all()


class EquipmentRequest(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True, null=True)
    request_out = models.DateTimeField(null=True)
    request_in = models.DateTimeField(null=True)
    # no on_delete option possible. What happens when an item is deleted?
    equipment_items = models.ManyToManyField(
        EquipmentInstance, related_name="linked_requests"
    )
    # when the referenced object is deleted (i.e. the User), do not delete the request, but rather
    # set the ForeignKey to null. This is only possible if null is True.
    user = models.ForeignKey(
        User, related_name="linked_requests", on_delete=models.SET_NULL, null=True
    )

    actual_out = models.DateTimeField(null=True, blank=True)
    actual_in = models.DateTimeField(null=True, blank=True)

    class Status(models.TextChoices):
        REQUESTED = "Requested"
        SIGNEDOUT = "Signed Out"
        RETURNED = "Returned"

    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.REQUESTED
    )
