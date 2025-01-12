#!/bin/bash -x
python manage.py migrate --noinput || exit 1

exec "$@"
