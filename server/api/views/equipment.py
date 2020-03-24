from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from api.models import *
from rest_framework import viewsets
from api.serializers import *

from django.http import JsonResponse

class EquipmentTypeList(APIView):
    def get(self, request, format=None):
        equipments = EquipmentType.objects.all()
        serializer = EquipmentTypeSerializer(equipments, many=True, context={'request': request})
        return Response(serializer.data)

class EquipmentCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Equipment Types to be viewed or edited.
    """
    queryset = EquipmentCategory.objects.all()
    serializer_class = EquipmentCategorySerializer

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

class EquipmentRequestViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Equipment Requests to be viewed or edited.
    """
    queryset = EquipmentRequest.objects.all()
    serializer_class = EquipmentRequestSerializer

class EquipmentAvailabilityViewSet(viewsets.ViewSet): # TODO: needs testing
    def create(self, request, format=None): # Equivalent of post in normal views
        serializer = EquipmentAvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            equipment_item_id = serializer.data['equipment_item']['id']
            equipment_item = EquipmentItem.objects.get(pk=equipment_item_id)
            for request in equipment_item.linked_requests.all():
                if (serializer.request_out < request.request_out) or (serializer.request_in > request.request_in):
                    return Response(False)
                return Response(True)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

def list_equipment(request, format=None):
    all_equipment = list(EquipmentType.objects.values())
    return JsonResponse(all_equipment, safe=False)