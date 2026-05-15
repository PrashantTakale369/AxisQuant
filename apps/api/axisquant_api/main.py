"""AxisQuant FastAPI application entrypoint."""

from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import get_settings
from .core.logging import configure_logging, get_logger
from .routers import health

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    configure_logging()
    settings = get_settings()
    logger.info(
        "axisquant-api.startup",
        env=settings.env,
        hf_org=settings.hf_org,
        github_org=settings.github_org,
    )
    yield
    logger.info("axisquant-api.shutdown")


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="AxisQuant API",
        version="0.0.0",
        description=(
            "Backend for axisquant.org — Hugging Face integration, GitHub integration, "
            "scheduled jobs, contact, webhooks. Frontend (Next.js) handles all rendering "
            "and direct DB CRUD."
        ),
        docs_url="/docs",
        redoc_url=None,
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    app.include_router(health.router, prefix="/api")

    return app


app = create_app()
