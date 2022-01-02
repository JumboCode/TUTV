from django.db import models
from django.db.models.deletion import CASCADE
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

    def types(self):
        return self.linked_types.all()


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

    def items(self):
        return self.linked_items.all()


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
        return self.name

    def instances(self):
        return self.linked_instances.all()

    def num_instances(self):
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
    created_at = models.DateTimeField(auto_now_add=True, editable=False)

    def __str__(self):
        if hasattr(self.equipment_item_FK, "name"):
            return f"{self.equipment_item_FK.name} #{self.id_of_item} of {self.equipment_item_FK.num_instances()}"
        else:
            return f"(No equipment item name) #{self.id_of_item}"

    def assoc_requests(self):
        return self.linked_requests.all()


class EquipmentRequest(models.Model):
    """
    A request that involves many equipment instances.
    """

    """
    These fields are filled when the request is first created.
    """
    timestamp = models.DateTimeField(auto_now_add=True)
    project = models.CharField(max_length=200)
    request_out = models.DateTimeField()
    request_in = models.DateTimeField()

    # The "through" table allows us to provide additional information on the
    # many-to-many relationship. https://www.youtube.com/watch?v=-HuTlmEVOgU
    equipment_items = models.ManyToManyField(
        EquipmentItem, through="EquipmentRequestItemQty")

    # SET_NULL means that when a user is deleted (the referenced object), we set
    # the FK here to NULL (rather than delete this request). This is only
    # possible if null is True for this field.
    user = models.ForeignKey(
        User, related_name="linked_requests", on_delete=models.SET_NULL, null=True
    )

    """
    These fields are filled until the request is fulfilled by a board member.
    """
    # we need to keep track of both items (with quantity) and instances since
    # the instances aren't available to us until the request is fulfilled by a
    # board member.
    equipment_instances = models.ManyToManyField(
        EquipmentInstance, related_name="linked_requests", blank=True
    )
    actual_out = models.DateTimeField(null=True, blank=True)
    actual_in = models.DateTimeField(null=True, blank=True)
    approving_board_member = models.ForeignKey(
        User, related_name="linked_approvals", on_delete=models.SET_NULL, null=True, blank=True)

    class Status(models.TextChoices):
        REQUESTED = "Requested"
        CONFIRMED = "Confirmed"
        SIGNEDOUT = "Signed Out"
        RETURNED = "Returned"
        CANCELLED = "Cancelled"

    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.REQUESTED
    )

    def __str__(self):
        return f"({self.status}) Request made by {self.user.username if self.user else 'unknown user'} for {self.project}"


class EquipmentRequestItemQty(models.Model):
    """
    Intermediate table for adding quantity information for the many-to-many
    relationship between EquipmentRequest and EquipmentItem. 
    """
    # CASCADE means that when the request is deleted, delete this request item
    # quantity entry as well
    request = models.ForeignKey(EquipmentRequest, on_delete=CASCADE)
    item = models.ForeignKey(EquipmentItem, on_delete=CASCADE)
    quantity = models.IntegerField()

    # this ensures that for every request, there is only one quantity entry per
    # item
    class Meta:
        unique_together = ("request", "item")

    def __str__(self):
        return f"{self.request} - {self.item} x{self.quantity}"
