"""Runtime configuration. Validated via Pydantic Settings — fails fast on bad env."""

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ---- App ----
    env: Literal["development", "staging", "production"] = "development"
    log_level: Literal["debug", "info", "warning", "error"] = "info"
    cors_allow_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])

    # ---- External orgs ----
    hf_org: str = "AxisQuant"
    github_org: str = "AxisQuant"

    # ---- Tokens ----
    hf_token: str | None = None
    github_token: str | None = None

    # ---- Storage ----
    database_url: str | None = None
    redis_url: str = "redis://localhost:6379/0"

    # ---- Cache TTLs (seconds) ----
    hf_list_ttl: int = 3600
    hf_detail_ttl: int = 1800
    github_repos_ttl: int = 3600

    # ---- Email / webhooks (Phase 7) ----
    resend_api_key: str | None = None
    contact_inbox_email: str = "research@axisquant.org"
    slack_webhook_url: str | None = None

    # ---- Webhook signing ----
    benchmark_webhook_secret: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()
