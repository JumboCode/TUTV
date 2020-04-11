from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from api.models import *
from rest_framework import viewsets
from api.serializers import *

import datetime

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

# class EquipmentAvailabilityViewSet(viewsets.ViewSet): # TODO: needs testing
#     def create(self, request, format=None): # Equivalent of post in normal views
#         serializer = EquipmentAvailabilitySerializer(data=request.data)
#         if serializer.is_valid():
#             equipment_item_id = serializer.data['equipment_item']['id']
#             equipment_item = EquipmentItem.objects.get(pk=equipment_item_id)
#             for request in equipment_item.linked_requests.all():
#                 if (serializer.request_out < request.request_out) or (serializer.request_in > request.request_in):
#                     return Response(False)
#                 return Response(True)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

def get_availability(request, request_out, request_in, equipment_item_id):
    request_out_fmt = datetime.datetime.strptime(request_out, "%Y-%m-%dT%H:%M:%S%z")
    request_in_fmt = datetime.datetime.strptime(request_in, "%Y-%m-%dT%H:%M:%S%z")
    
    if EquipmentItem.objects.filter(id = equipment_item_id).count() == 0:
        return JsonResponse("Equipment not found", status=status.HTTP_400_BAD_REQUEST, safe=False)
    equipment_item = EquipmentItem.objects.get(pk=equipment_item_id)
    
    if request_out_fmt > request_in_fmt:
        return JsonResponse("Request out cannot be later than request in", status=status.HTTP_400_BAD_REQUEST, safe=False)

    for request in equipment_item.linked_requests.all():
        print("Checking request ID", request.id)
        if (request_out_fmt < request.request_out) or (request_in_fmt > request.request_in):
            return JsonResponse(False, safe=False)
    return JsonResponse(True, safe=False)

def list_equipment(request, format=None):
    all_equipment = list(EquipmentType.objects.values())
    return JsonResponse(all_equipment, safe=False)