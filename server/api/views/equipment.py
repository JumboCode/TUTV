from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from api.models import *
from rest_framework import viewsets
from api.serializers import *

import datetime

from django.http import JsonResponse

from django.shortcuts import get_object_or_404

"""
request in EquipmentCategoryViewSet => context object => pass into
EquipmentCategorySerializerWithTime => pass into EquipmentTypeSerializerWithTime =>
pass into EquipmentItemSerializerWithTime => EquipmentItemSerializerWithTime uses
SerializerMethodField to dynamically get num_available
"""
class EquipmentCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Equipment Categories to be viewed or edited.
    """

    queryset = EquipmentCategory.objects.all()
    
    # Pass the GET request time parameters as context if they are present
    def get_serializer_context(self, *args, **kwargs):
        req_args = self.request.query_params

        # Check if time out and time in parameters are provided, if so
        # then use a separate serializer to retrieve only available items
        if ((req_args.get('out') == None) or (req_args.get('in') == None)):
            return None
        else: 
            return {
                    'request_out': req_args.get('out'),
                    'request_in' : req_args.get('in')
            }

    # Use the time serializer if time parameters passed in GET request
    def get_serializer_class(self):
        req_args = self.request.query_params

        # Check if time out and time in parameters are provided, if so
        # then use a separate serializer to retrieve only available items
        if ((req_args.get('out') == None) or (req_args.get('in') == None)):
            return EquipmentCategorySerializer
        else: 
            return EquipmentCategorySerializerWithTime


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


class EquipmentInstanceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Equipment Instances to be viewed or edited.
    """

    queryset = EquipmentInstance.objects.all()
    serializer_class = EquipmentInstanceSerializer


class EquipmentRequestViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Equipment Requests to be viewed or edited.
    Filters the equipment requests so that only those associated with the
        current user are shown.
    """

    # Confirm that user is logged in
    permission_classes = [IsAuthenticated]

    serializer_class = EquipmentRequestSerializer

    # get_queryset is necessary for accessing the request member of this class
    def get_queryset(self):
        # filtering for EquipmentRequest objects associated with the
        # current user
        queryset = EquipmentRequest.objects.filter(user=self.request.user)
        return queryset

    # override the create method to auto-populate the user making the request
    # the serializer.save() method will essentially call either create or update
    # on the serializer. The additional argument we pass in here will be added
    # as part of the "validated_data" argument that create() receives in the
    # serializer
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EquipmentRequestViewSetAdmin(viewsets.ModelViewSet):
    """
    API endpoint that allows Equipment Requests to be viewed or edited.
    This endpoint is only accessible by admin users and it returns
        all EquipmentRequest objects
    """

    # Confirm that user is logged in, and that user is an administrator
    permission_classes = [IsAuthenticated, IsAdminUser]

    # Return all EquipmentRequests for admin
    queryset = EquipmentRequest.objects.all()

    serializer_class = EquipmentRequestSerializer


def get_availability(request):
    # Reference: https://www.webforefront.com/django/accessurlparamstemplates.html
    request_out = request.GET.get("out")
    request_in = request.GET.get("in")
    equipment_item_id = request.GET.get("id")
    if None in (request_out, request_in, equipment_item_id):
        return JsonResponse(
            "Incorrect query format. Format is ?out={}&in={}&id={}",
            status=status.HTTP_400_BAD_REQUEST,
            safe=False,
        )

    request_out_fmt = datetime.datetime.strptime(
        request_out, "%Y-%m-%dT%H:%M:%S%z")
    request_in_fmt = datetime.datetime.strptime(
        request_in, "%Y-%m-%dT%H:%M:%S%z")

    # Check if the item ID provided exists
    if EquipmentInstance.objects.filter(id=equipment_item_id).count() == 0:
        return JsonResponse(
            "Equipment not found", status=status.HTTP_400_BAD_REQUEST, safe=False
        )
    equipment_item = EquipmentInstance.objects.get(pk=equipment_item_id)

    # Check if request out is earlier than request in
    if request_out_fmt > request_in_fmt:
        return JsonResponse(
            "Request out cannot be later than request in",
            status=status.HTTP_400_BAD_REQUEST,
            safe=False,
        )

    # Return true if equipment is available during the specified time and
    # false otherwise
    for equipment_request in equipment_item.linked_requests.all():
        print("Checking request ID", equipment_request.id)
        if (request_out_fmt < equipment_request.request_out) or (
            request_in_fmt > equipment_request.request_in
        ):
            return JsonResponse(False, safe=False)
    return JsonResponse(True, safe=False)


"""
Partially update a request to reflect its signed out status
Reference: https://stackoverflow.com/questions/50129567/django-rest-update-one-field
"""

# class new_request(APIView):
#     def post(self, request, format=None):
#         serializer = EquipmentRequestSerializer(data=request.data)


class sign_out_request(APIView):
    def patch(self, request, request_id):
        # if no model exists by this PK, raise a 404 error
        equipment_request = get_object_or_404(EquipmentRequest, pk=request_id)
        if equipment_request.status != "Requested":
            return Response(
                "This request has already been signed out!",
                status=status.HTTP_400_BAD_REQUEST,
            )
        # this is the only field we want to update
        data = {
            "actual_out": datetime.datetime.now(),
            "status": equipment_request.Status.SIGNEDOUT,
        }
        serializer = EquipmentRequestSerializer(
            equipment_request, data=data, partial=True
        )

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
            return Response(
                "This request has already been returned!",
                status=status.HTTP_400_BAD_REQUEST,
            )
        if equipment_request.status == "Requested":
            return Response(
                "This request has not been signed out yet!",
                status=status.HTTP_400_BAD_REQUEST,
            )
        # this is the only field we want to update
        data = {
            "actual_in": datetime.datetime.now(),
            "status": equipment_request.Status.RETURNED,
        }
        serializer = EquipmentRequestSerializer(
            equipment_request, data=data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        # return a meaningful error response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
