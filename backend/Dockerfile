# Repo kökü `backend/` ise Railway bu Dockerfile’ı kullanır (`Root Directory = backend`).
# Servis kökü monorepo kökü ise repodaki **`/Dockerfile`** kullanılmalı (`COPY backend/...`).

FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /app/entrypoint.sh

RUN DJANGO_SECRET_KEY=collectstatic-build-only python manage.py collectstatic --noinput --clear

EXPOSE 8080

CMD ["/app/entrypoint.sh"]
