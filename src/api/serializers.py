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


class EquipmentTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EquipmentType
        fields = '__all__'

class EquipmentItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EquipmentItem
        fields = '__all__'
