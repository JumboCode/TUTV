from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '%37to9jwjy*x4ai*+zt@lz$rm+8hko!7l*6=o4(y-f^6#@!h1)'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

STATIC_URL = '/'
STATIC_ROOT = os.path.join(BASE_DIR, "static")
