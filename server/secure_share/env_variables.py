import os
from enum import Enum


class EnvVariable(Enum):
    SECRET_KEY = os.environ["SECRET_KEY"]
    ALLOWED_HOSTS = os.environ["ALLOWED_HOSTS"]
    DEBUG = os.environ["DEBUG"]
    FRONTEND_URL = os.environ["FRONTEND_URL"]
