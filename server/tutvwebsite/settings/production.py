import os
import django_heroku
from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

django_heroku.settings(locals())

STATIC_URL = '/'
STATIC_ROOT = os.path.join(BASE_DIR, "static")
