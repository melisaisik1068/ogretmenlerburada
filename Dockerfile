# Railway: build context repo kökü olduğunda (Root Directory boş veya "." ) bu dosya seçilir.
# backend/ klasöründeki Django API’yi imajlar.

FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# collectstatic için geçici anahtar — imaj katmanında ENV ile gizli anahtar tutmuyoruz
RUN DJANGO_SECRET_KEY=collectstatic-build-only python manage.py collectstatic --noinput --clear

EXPOSE 8080

CMD ["sh", "-c", "exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8080} --workers 2 --timeout 120"]
