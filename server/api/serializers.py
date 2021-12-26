from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import *

"""
The HyperlinkedModelSerializer class is similar to the ModelSerializer
class except that it uses hyperlinks to represent relationships, rather
than primary keys. 
"""

"""
Serializers to support seralizing User and Group objects
"""


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "groups",
            "is_staff",
            "linked_requests",
        ]

        depth = 1  # To include details of linked_requests


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["admin", "user"]


class EquipmentInstanceSerializer(serializers.ModelSerializer):
    """
    Serializers to support seralizing EquipmentInstance objects
    """

    class Meta:
        model = EquipmentInstance
        fields = "__all__"

        """
        Uncomment to pull in type and category data rather than their
        primary keys.
        """
        # depth = 2


class EquipmentItemSerializer(serializers.ModelSerializer):
    """
    Serializers to support seralizing EquipmentItem objects
    """

    class Meta:
        model = EquipmentItem
        fields = [
            "id",
            "name",
            "description",
            "image",
            "product_url",
            "equipment_type_FK",
            "num_instances",
        ]


class EquipmentTypeSerializer(serializers.ModelSerializer):
    """
    Serializers to support seralizing EquipmentType objects
    """

    items = EquipmentItemSerializer(many=True, read_only=True)

    class Meta:
        model = EquipmentType
        fields = ["id", "name", "description",
                  "equipment_category_FK", "items"]


class EquipmentCategorySerializer(serializers.ModelSerializer):
    """
    Serializers to support serializing EquipmentCategory objects
    """

    types = EquipmentTypeSerializer(many=True, read_only=True)

    class Meta:
        model = EquipmentCategory
        fields = ["id", "name", "description", "types"]


class EquipmentRequestItemQtySerializer(serializers.ModelSerializer):
    """
    Serializers to support serializing EquipmentRequestItemQty objects
    """
    class Meta:
        model = EquipmentRequestItemQty
        fields = ('item', 'quantity')


class EquipmentRequestSerializer(serializers.ModelSerializer):
    """
    Serializers to support serializing EquipmentRequests objects
    """

    # Note that the source here needs to be specified (the source defaults to
    # the same name as the serializer field equipment_items, which isn't the
    # case here), and it must be in lower case. "equipmentrequestitemqty_set" is
    # the default related field name of the equipment_items field in the request
    # mode. The naming gets a bit confusing here with the through Model; this
    # post is helpful:
    # https://stackoverflow.com/questions/17256724/include-intermediary-through-model-in-responses-in-django-rest-framework
    #
    equipment_items = EquipmentRequestItemQtySerializer(
        source="equipmentrequestitemqty_set", many=True)

    class Meta:
        model = EquipmentRequest
        fields = ("id", "timestamp", "project", "request_out", "request_in",
                  "actual_out", "actual_in", "status", "user",
                  "approving_board_member", "equipment_items",
                  "equipment_instances")

    # This create method override is required to populate the through
    # intermediate model (EquipmentRequestItemQty)
    def create(self, validated_data):
        item_qty_data = validated_data.pop('equipmentrequestitemqty_set')
        request = EquipmentRequest.objects.create(**validated_data)
        for item_qty in item_qty_data:
            EquipmentRequestItemQty.objects.create(request=request, **item_qty)

        return request
