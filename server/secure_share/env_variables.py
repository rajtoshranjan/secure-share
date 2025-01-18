import os
from enum import Enum


class EnvVariable(Enum):
    SECRET_KEY = os.environ["SECRET_KEY"]
    ALLOWED_HOSTS = os.environ["ALLOWED_HOSTS"]
    DEBUG = os.environ["DEBUG"]
    ALLOWED_CORS_DOMAINS = os.environ["ALLOWED_CORS_DOMAINS"]
