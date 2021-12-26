import os
from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '%37to9jwjy*x4ai*+zt@lz$rm+8hko!7l*6=o4(y-f^6#@!h1)'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Adds CORS headers for local testing only to allow the frontend, which is
# served on localhost:3000, to access the API, which is served on
# localhost:8000.
CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
CORS_ALLOW_CREDENTIALS = True

MEDIA_ROOT = os.path.join(BASE_DIR, "media")
# TODO: set MEDIA_URL to something?
# https://docs.djangoproject.com/en/3.0/ref/models/fields/#django.db.models.FileField.storage
# https://docs.djangoproject.com/en/3.0/ref/models/fields/#imagefield
