from django.urls import include, path, re_path
from rest_framework import routers
import api.views as views
from rest_framework.urlpatterns import format_suffix_patterns

router = routers.DefaultRouter()

# These routes are registered for views defined with Django's ModelViewset.
# They support HTTP GET, PUT, PATCH, DELETE
<<<<<<< HEAD
router.register(r"users", views.UserViewSet)
router.register(r"equipment-instances", views.EquipmentInstanceViewSet)
router.register(r"equipment-items", views.EquipmentItemViewSet)
router.register(r"equipment-types", views.EquipmentTypeViewSet)
router.register(r"equipment-categories", views.EquipmentCategoryViewSet)
router.register(
    r"equipment-requests", views.EquipmentRequestViewSet, basename="EquipmentRequest"
)
router.register(r"admin/all-equipment-requests",
                views.EquipmentRequestViewSetAdmin)
=======
router.register(r'users', views.UserViewSet)
router.register(r'equipment-types', views.EquipmentTypeViewSet)
router.register(r'equipment-types-time', views.EquipmentTypeTimeViewSet)
router.register(r'equipment-items', views.EquipmentItemViewSet)
router.register(r'equipment-categories', views.EquipmentCategoryViewSet)
router.register(r'equipment-requests', views.EquipmentRequestViewSet,basename='EquipmentRequest')
router.register(r'equipment-requests-admin', views.EquipmentRequestViewSetAdmin)
>>>>>>> cfd1019de3201abbfa30e1469f98f4e0256a0efc

urlpatterns = [
    *router.urls,
    # re_path(r'equipment', views.list_equipment),
    re_path(r"^availability/$", views.get_availability),
    path("signout/<int:request_id>/", views.sign_out_request.as_view()),
    path("return/<int:request_id>/", views.return_request.as_view()),
]
