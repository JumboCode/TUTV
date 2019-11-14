from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from api.models import EquipmentType, EquipmentItem
from rest_framework import viewsets
from api.serializers import EquipmentTypeSerializer, EquipmentItemSerializer

class EquipmentTypeList(APIView):
    def get(self, request, format=None):
        equipments = EquipmentType.objects.all()
        serializer = EquipmentTypeSerializer(equipments, many=True, context={'request': request})
        return Response(serializer.data)

class EquipmentTypeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Equipment Types to be viewed or edited.
    """
    queryset = EquipmentType.objects.all()
    serializer_class = EquipmentTypeSerializer


class EquipmentItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Equipment Items to be viewed or edited.
    """
    queryset = EquipmentItem.objects.all()
    serializer_class = EquipmentItemSerializer    