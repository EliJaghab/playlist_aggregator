#!/bin/sh
exec uvicorn django_backend.asgi:application --host 0.0.0.0 --port ${PORT:-8000} --lifespan off