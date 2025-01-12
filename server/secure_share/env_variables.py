import os
from enum import Enum


class EnvVariable(Enum):
    SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
    ALLOWED_HOSTS = os.environ["DJANGO_ALLOWED_HOSTS"]
    DEBUG = os.environ["DEBUG"]
