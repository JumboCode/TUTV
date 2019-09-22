from django.conf.urls import url
from . import views

urlpatterns = [
    # ... the rest of the urlpatterns ...
    # must be catch-all for pushState to work
    url(r'^', views.FrontendAppView.as_view()),
]
