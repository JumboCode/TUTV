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
        fields = ["id", "name", "description", "equipment_category_FK", "items"]


class EquipmentCategorySerializer(serializers.ModelSerializer):
    """
    Serializers to support serializing EquipmentCategory objects
    """

    types = EquipmentTypeSerializer(many=True, read_only=True)

    class Meta:
        model = EquipmentCategory
        fields = ["id", "name", "description", "types"]


class EquipmentRequestSerializer(serializers.ModelSerializer):
    """
    Serializers to support serializing EquipmentRequests objects
    """

    class Meta:
        model = EquipmentRequest
        fields = "__all__"
