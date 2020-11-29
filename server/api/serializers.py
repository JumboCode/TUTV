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
        fields = ['email', 'first_name', 'last_name', 'groups', 'is_staff', 'linked_requests']
        
        depth = 1 # To include details of linked_requests

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['admin', 'user']


"""
Serializers to support serializing EquipmentCategory objects
"""
class EquipmentCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EquipmentCategory
        fields = "__all__"


"""
Serializers to support seralizing EquipmentType objects
"""
class EquipmentItemSerializerSimple(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EquipmentItem
        fields = ['id', 'url']

class EquipmentTypeSerializer(serializers.HyperlinkedModelSerializer):
    items = EquipmentItemSerializerSimple(many=True, required=False, read_only=True)

    class Meta:
        model = EquipmentType
        fields = "__all__"



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
    class Meta:
        model = EquipmentType
        fields = ['name', 'id', 'url']

class EquipmentItemSerializer(serializers.ModelSerializer):
    # equipment_type = EquipmentTypeSerializerSimple(read_only=True)

    class Meta:
        model = EquipmentItem
        fields = "__all__"
        
        """
        Uncomment to pull in type and category data rather than their
        primary keys. Might not be a good idea though, since only primary
        keys can be received in POST. Pending a better solution.
        """
        # depth = 2 


"""
Serializers to support serializing EquipmentRequests objects
"""
class EquipmentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentRequest
        fields = '__all__'


"""
Parameters: Takes in a request object (request) and also an equipment's id (eid)
Returns: True or False based on the availability of the equipment item in the 
    provided timeframe (request object)

Assumes a properly formatted request parameter and does not return an error
    if it is invalid (instead returns false).
"""
def check_availability(request, eid):
    request_out = request.GET.get('out')
    request_in = request.GET.get('in')
    equipment_item_id = eid
    if None in (request_out, request_in, equipment_item_id):
        return False
    
    request_out_fmt = datetime.datetime.strptime(request_out, "%Y-%m-%dT%H:%M:%S%z")
    request_in_fmt = datetime.datetime.strptime(request_in, "%Y-%m-%dT%H:%M:%S%z")
    
    # Check if the item ID provided exists
    if EquipmentItem.objects.filter(id = equipment_item_id).count() == 0:
        return False
    equipment_item = EquipmentItem.objects.get(pk=equipment_item_id)
    
    # Check if request out is earlier than request in
    if request_out_fmt >= request_in_fmt:
        return False

    # Return true if equipment is available during the specified time and
    # false otherwise
    # if request_out happens within the equipment request period
    #   or if request_in happens within the equipment request period
    # or if the request_out and request_in surround the equipment request period
    for equipment_request in equipment_item.linked_requests.all():
        if ((request_out_fmt > equipment_request.request_out and request_out_fmt < equipment_request.request_in) 
            or (request_in_fmt < equipment_request.request_in and request_in_fmt > equipment_request.request_out)
            or (request_out_fmt <= equipment_request.request_out and request_in_fmt >= equipment_request.request_in)):
            return False
    return True