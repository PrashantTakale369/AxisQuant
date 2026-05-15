"""Health and readiness probes."""

from fastapi import APIRouter
from pydantic import BaseModel

from .. import __version__

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    status: str
    version: str
    service: str


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok", version=__version__, service="axisquant-api")
