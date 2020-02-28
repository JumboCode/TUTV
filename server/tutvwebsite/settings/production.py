import os
import django_heroku
from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

MIDDLEWARE = ['whitenoise.middleware.WhiteNoiseMiddleware', ] + MIDDLEWARE
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

ALLOWED_HOSTS = ['*']

django_heroku.settings(locals())
