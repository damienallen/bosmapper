FROM python:3.14-slim-trixie AS service
WORKDIR /service

# Install linux dependencies
RUN apt-get update && apt-get install -y libcairo2-dev
ENV export DISPLAY=:99.0

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Add venv to path
ENV VIRTUAL_ENV=/service/.venv \
    PATH="/service/.venv/bin:$PATH"

# Add caching layer for project files
ADD README.md pyproject.toml uv.lock ./
ADD ./src/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

# Install external dependencies
RUN uv sync --frozen --no-install-project

# Copy and install service
ADD ./src ./src/
RUN uv sync --frozen

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]


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
COPY --from=static-builder /app/dist /var/www
COPY Caddyfile /etc/caddy/Caddyfile
