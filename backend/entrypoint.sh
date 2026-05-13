#!/bin/sh
set -e

echo ">>> Running migrations..."
python manage.py migrate --noinput

echo ">>> Creating/updating admin account..."
python manage.py create_admin

echo ">>> Starting gunicorn..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8080} --workers 2 --timeout 120
