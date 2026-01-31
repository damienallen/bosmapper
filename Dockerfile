#
# Python image for backend
#
FROM python:3.14-slim-trixie AS service
WORKDIR /service

RUN apt-get update && apt-get install -y libcairo2-dev build-essential
ENV DISPLAY=:99.0

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
ENV VIRTUAL_ENV=/service/.venv \
    PATH="/service/.venv/bin:$PATH"

ADD README.md pyproject.toml uv.lock ./

RUN uv sync --frozen --no-install-project

# Copy and install service
ADD ./bosmapper ./bosmapper/
RUN uv sync --frozen

EXPOSE 8000
CMD ["uvicorn", "bosmapper.main:app", "--host", "0.0.0.0", "--port", "8888"]


#
# Caddy image with baked in static and SPA
#
FROM node:24-trixie-slim AS static-builder
WORKDIR /app

COPY ./app/package.json ./app/package-lock.json /app/
RUN npm ci

COPY ./app /app/
RUN npm run build

FROM caddy:2-alpine AS static
COPY --from=static-builder /app/build /var/www
COPY Caddyfile /etc/caddy/Caddyfile
