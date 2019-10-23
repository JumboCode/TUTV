from django.urls import include, path, re_path
from rest_framework import routers
import api.views as views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    # ... the rest of the urlpatterns ...
    # must be catch-all for pushState to work
    *router.urls,
    re_path(r'^', views.FrontendAppView.as_view()),
]
