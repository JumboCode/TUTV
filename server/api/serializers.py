from typing import OrderedDict
from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import *
import datetime

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

class EquipmentItemSerializerWithTime(serializers.ModelSerializer):
    """
    Helper class for EquipmentCategorySerializerWithTime
    Has logic to find the number of item instances available based
        on the time parameters in the GET request
    """
    num_available = serializers.SerializerMethodField('get_num_available')
    def get_num_available(self, obj):
        available_count = 0
        item_inst = obj.instances()
        n = obj.num_instances()
        time_out_string = self.context.get('request_out')
        time_in_string = self.context.get('request_in')
        time_out = datetime.datetime.strptime(time_out_string, "%Y-%m-%dT%H:%M:%S%z")
        time_in = datetime.datetime.strptime(time_in_string, "%Y-%m-%dT%H:%M:%S%z")

        for i in range(n):
            instance = item_inst[i]
            requests = instance.assoc_requests()
            time_conflict = False

            # logic to see if existing request overlaps with GET request time
            for assoc_request in requests:
                if (assoc_request.request_out <= time_out):
                    if (assoc_request.request_in >= time_out):
                        time_conflict = True
                if (assoc_request.request_out > time_out):
                    if (assoc_request.request_out <= time_in):
                        time_conflict = True
            
            if not time_conflict:
                available_count += 1
        return available_count
    
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
            "num_available",
        ]

class EquipmentTypeSerializer(serializers.ModelSerializer):
    """
    Serializers to support seralizing EquipmentType objects
    """

    items = EquipmentItemSerializer(many=True, read_only=True)

<<<<<<< HEAD
=======

"""
Serializers to support serializing EquipmentItem objects
"""
        
class EquipmentItemSerializerTime(serializers.HyperlinkedModelSerializer):
    available = serializers.SerializerMethodField('is_available')

    def is_available(self, obj):
        if check_availability(self.context.get("request"), obj.id):
            return True 
        else:
            return False

    class Meta:
        model = EquipmentItem
        fields = ['id', 'url', 'available']

class EquipmentTypeTimeSerializer(serializers.HyperlinkedModelSerializer):
    items = EquipmentItemSerializerTime(many=True, required=False, read_only=True)

    class Meta:
        model = EquipmentType
        fields = "__all__"

class EquipmentTypeSerializerSimple(serializers.HyperlinkedModelSerializer):
>>>>>>> cfd1019de3201abbfa30e1469f98f4e0256a0efc
    class Meta:
        model = EquipmentType
        fields = ["id", "name", "description",
                  "equipment_category_FK", "items"]

class EquipmentTypeSerializerWithTime(serializers.ModelSerializer):
    """
    Helper class for EquipmentCategorySerializerWithTime
    Redefined __init__ allows for context to be passed through
    """
    items = EquipmentItemSerializerWithTime(many=True, read_only=True)

    class Meta:        
        model = EquipmentType
        fields = ["id", "name", "description",
                  "equipment_category_FK", "items"]
        depth = 1
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['items'].context.update(self.context)

class EquipmentCategorySerializer(serializers.ModelSerializer):
    """
    Serializers to support serializing EquipmentCategory objects
    """

    types = EquipmentTypeSerializer(many=True, read_only=True)

    class Meta:
        model = EquipmentCategory
        fields = ["id", "name", "description", "types"]

class EquipmentCategorySerializerWithTime(serializers.ModelSerializer):
    """
    Serialize EquipmentCategory restricted by time availability of request
    """
    types = EquipmentTypeSerializerWithTime(many=True, read_only=True)

    class Meta:
        model = EquipmentCategory
        fields = ["id", "name", "description", "types"]
        depth = 2
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['types'].context.update(self.context)

class EquipmentRequestItemQtySerializer(serializers.ModelSerializer):
    """
    Serializers to support serializing EquipmentRequestItemQty objects
    """
    # both fields are needed so that when posting, the client only needs to
    # provide the id of the item in the request. However, when getting, we also
    # get the full info of the item so that the dashboard can display them.
    item_id = serializers.PrimaryKeyRelatedField(
        source="item", queryset=EquipmentItem.objects.all())
    item = EquipmentItemSerializer(read_only=True)

    class Meta:
        model = EquipmentRequestItemQty
        fields = ('item_id', 'item', 'quantity')


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

        return request  # we need to return the serialized object
