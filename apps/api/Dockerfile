# syntax=docker/dockerfile:1.7
FROM python:3.12-slim AS base
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1

# uv is the dependency manager
COPY --from=ghcr.io/astral-sh/uv:0.10.11 /uv /uvx /usr/local/bin/

WORKDIR /app

# ---- Dependency layer (cached) ----
COPY pyproject.toml ./
RUN uv sync --no-dev --no-install-project

# ---- App layer ----
COPY axisquant_api ./axisquant_api
RUN uv sync --no-dev

ENV PATH="/app/.venv/bin:$PATH"

# Non-root user
RUN useradd --create-home --uid 10001 axis && chown -R axis:axis /app
USER axis

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request, sys; r = urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=3); sys.exit(0 if r.status == 200 else 1)"

CMD ["uvicorn", "axisquant_api.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
