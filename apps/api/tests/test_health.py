"""Smoke test — confirms the app boots and the health endpoint responds."""

from fastapi.testclient import TestClient

from axisquant_api.main import app


def test_health_endpoint_returns_ok() -> None:
    with TestClient(app) as client:
        response = client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "axisquant-api"
    assert "version" in body


def test_openapi_schema_is_served() -> None:
    with TestClient(app) as client:
        response = client.get("/openapi.json")
    assert response.status_code == 200
    assert response.json()["info"]["title"] == "AxisQuant API"
