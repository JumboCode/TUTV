from django.urls import include, path, re_path
from rest_framework import routers
import api.views as views
from rest_framework.urlpatterns import format_suffix_patterns

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'equipment-types', views.EquipmentTypeViewSet)
router.register(r'equipment-items', views.EquipmentItemViewSet)


urlpatterns = [
    # ... the rest of the urlpatterns ...
    # must be catch-all for pushState to work
    *router.urls,
    # re_path(r'equipment', views.list_equipment),
    
    # re_path(r'^', views.FrontendAppView.as_view()),
]
