import os
import django_heroku
from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

STATIC_URL = '/'
STATIC_ROOT = os.path.join(BASE_DIR, "static")
django_heroku.settings(locals())
