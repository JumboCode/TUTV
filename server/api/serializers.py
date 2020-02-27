from django.contrib.auth.models import User, Group
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from .models import *

# Serializers to support seralizing User and Group objects
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        # Should it have the 'username' field?
        fields = ['email', 'first_name', 'last_name', 'groups', 'is_staff', 'username']

# from from https://medium.com/@dakota.lillie/django-react-jwt-authentication-5015ee00ef9a
class UserSerializerWithToken(serializers.HyperlinkedModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password')

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

# Serializers to support serializing EquipmentCategory objects
class EquipmentCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EquipmentCategory
        fields = "__all__"

# Serializers to support serializing EquipmentRequests objects
class EquipmentRequestsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = EquipmentRequest
        fields = '__all__'
