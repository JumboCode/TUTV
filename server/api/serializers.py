from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import *

"""
The HyperlinkedModelSerializer class is similar to the ModelSerializer
class except that it uses hyperlinks to represent relationships, rather
than primary keys. 
"""

# Serializers to support seralizing User and Group objects
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'groups', 'is_staff']

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
class EquipmentRequestsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EquipmentRequest
        fields = '__all__'