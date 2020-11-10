from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.models import *
from rest_framework import viewsets
from api.serializers import *

import datetime

from django.http import JsonResponse

from django.shortcuts import get_object_or_404

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
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # When user is not logged in, return nothing
        #if not user.is_authenticated:
        
        if user.is_staff or user.is_superuser:
            return EquipmentRequest.objects.all()
        else:
            return EquipmentRequest.objects.filter(user=user)
    
    serializer_class = EquipmentRequestSerializer

def get_availability(request):
    # Reference: https://www.webforefront.com/django/accessurlparamstemplates.html
    request_out = request.GET.get('out')
    request_in = request.GET.get('in')
    equipment_item_id = request.GET.get('id')
    if None in (request_out, request_in, equipment_item_id):
        return JsonResponse("Incorrect query format. Format is ?out={}&in={}&id={}", status=status.HTTP_400_BAD_REQUEST, safe=False)
    
    request_out_fmt = datetime.datetime.strptime(request_out, "%Y-%m-%dT%H:%M:%S%z")
    request_in_fmt = datetime.datetime.strptime(request_in, "%Y-%m-%dT%H:%M:%S%z")
    
    # Check if the item ID provided exists
    if EquipmentItem.objects.filter(id = equipment_item_id).count() == 0:
        return JsonResponse("Equipment not found", status=status.HTTP_400_BAD_REQUEST, safe=False)
    equipment_item = EquipmentItem.objects.get(pk=equipment_item_id)
    
    # Check if request out is earlier than request in
    if request_out_fmt > request_in_fmt:
        return JsonResponse("Request out cannot be later than request in", status=status.HTTP_400_BAD_REQUEST, safe=False)

    # Return true if equipment is available during the specified time and
    # false otherwise
    for equipment_request in equipment_item.linked_requests.all():
        print("Checking request ID", equipment_request.id)
        if (request_out_fmt < equipment_request.request_out) or (request_in_fmt > equipment_request.request_in):
            return JsonResponse(False, safe=False)
    return JsonResponse(True, safe=False)

"""
Partially update a request to reflect its signed out status
Reference: https://stackoverflow.com/questions/50129567/django-rest-update-one-field
"""
class sign_out_request(APIView):
    def patch(self, request, request_id):
        # if no model exists by this PK, raise a 404 error
        equipment_request = get_object_or_404(EquipmentRequest, pk=request_id)
        if equipment_request.status != "Requested":
            return Response("This request has already been signed out!", status=status.HTTP_400_BAD_REQUEST)
        # this is the only field we want to update
        data = {"actual_out": datetime.datetime.now(), "status": equipment_request.Status.SIGNEDOUT}
        serializer = EquipmentRequestSerializer(equipment_request, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        # return a meaningful error response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class return_request(APIView):
    def patch(self, request, request_id):
        # if no model exists by this PK, raise a 404 error
        equipment_request = get_object_or_404(EquipmentRequest, pk=request_id)
        if equipment_request.status == "Returned":
            return Response("This request has already been returned!", status=status.HTTP_400_BAD_REQUEST)
        if equipment_request.status == "Requested":
            return Response("This request has not been signed out yet!", status=status.HTTP_400_BAD_REQUEST)
        # this is the only field we want to update
        data = {"actual_in": datetime.datetime.now(), "status": equipment_request.Status.RETURNED}
        serializer = EquipmentRequestSerializer(equipment_request, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        # return a meaningful error response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
"""Deprecated"""
"""
class EquipmentTypeList(APIView):
    def get(self, request, format=None):
        equipments = EquipmentType.objects.all()
        serializer = EquipmentTypeSerializer(equipments, many=True, context={'request': request})
        return Response(serializer.data)

def list_equipment(request, format=None):
    all_equipment = list(EquipmentType.objects.values())
    return JsonResponse(all_equipment, safe=False)
"""