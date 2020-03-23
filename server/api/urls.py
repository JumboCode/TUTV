from django.urls import include, path, re_path
from rest_framework import routers
import api.views as views
from rest_framework.urlpatterns import format_suffix_patterns

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'equipment-types', views.EquipmentTypeViewSet)
router.register(r'equipment-items', views.EquipmentItemViewSet)
router.register(r'equipment-categories', views.EquipmentCategoryViewSet)
router.register(r'equipment-requests', views.EquipmentRequestViewSet)

urlpatterns = [
    *router.urls,
    re_path(r'equipment', views.list_equipment),
    path('snippets/', views.EquipmentTypeList.as_view()),
]
