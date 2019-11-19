from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import *


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'groups', 'is_staff']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['admin', 'user']


# Serializers to support seralizing EquipmentType objects


class EquipmentItemSerializerSimple(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EquipmentItem
        fields = ['id', 'url']

class EquipmentTypeSerializer(serializers.HyperlinkedModelSerializer):
    items = EquipmentItemSerializerSimple(many=True, required=False)

    class Meta:
        model = EquipmentType
        fields = ['name', 'items', 'url']


# Serializers to support serializing EquipmentItem objects


class EquipmentTypeSerializerSimple(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EquipmentType
        fields = ['name', 'id', 'url']

class EquipmentItemSerializer(serializers.HyperlinkedModelSerializer):
    equipment_type = EquipmentTypeSerializerSimple(read_only=True)

    class Meta:
        model = EquipmentItem
        fields = '__all__'

class EquipmentRequestsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EquipmentRequest
        fields = '__all__'