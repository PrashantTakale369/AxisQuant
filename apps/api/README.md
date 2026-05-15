# axisquant-api

FastAPI backend for AxisQuant. Owns:

- Hugging Face Hub integration (models, datasets, spaces) with Redis caching, retry, and circuit breaker
- GitHub org integration
- Aggregate stats for the landing page
- Contact form ingestion (DB + Resend + Slack webhook)
- Admin endpoints (CSV upload for benchmarks, cache invalidation)
- Scheduled jobs (HF refresh, GitHub refresh, contact sweep) via APScheduler

The Next.js frontend (`apps/web`) handles all rendering, MDX, and direct DB CRUD via Prisma server actions. This service handles ML-adjacent integrations where the Python ecosystem (`huggingface_hub`, future `transformers`/`datasets`) is a clear win.

## Local development

```bash
# from this directory
uv sync
uv run uvicorn axisquant_api.main:app --reload --port 8000
```

Health check: <http://localhost:8000/api/health>
OpenAPI docs: <http://localhost:8000/docs>

## Tests

```bash
uv run pytest
uv run ruff check .
uv run ruff format --check .
uv run mypy axisquant_api
```
