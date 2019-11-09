from api.models import EquipmentType, EquipmentItem
from rest_framework import viewsets
from api.serializers import EquipmentTypeSerializer, EquipmentItemSerializer

from django.http import JsonResponse


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


def list_equipment(request, format=None):
    all_equipment = list(EquipmentType.objects.values())
    return JsonResponse(all_equipment, safe=False)
