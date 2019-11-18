import os

from settings import *

REACT_APP_DIR = os.path.join(BASE_DIR, 'frontend')

STATICFILES_DIRS = [
    os.path.join(REACT_APP_DIR, 'build', 'static'),
]
