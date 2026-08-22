from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def login() -> str:
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "admin123"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "skillfolio-api"}


def test_profile_uses_admin_name() -> None:
    response = client.get("/api/profile", headers={"Authorization": f"Bearer {login()}"})
    assert response.status_code == 200
    assert response.json()["name"] == "Admin"


def test_explanation_returns_verified_matches_and_gaps() -> None:
    response = client.get(
        "/api/matches/m1/explain",
        headers={"Authorization": f"Bearer {login()}"},
    )
    body = response.json()
    assert response.status_code == 200
    assert body["matched_skills"] == ["SQL", "Data Visualization", "Python"]
    assert body["gaps"][0]["skill"] == "Statistical Modeling"
    assert "excluded" in body["fairness_note"]


def test_missing_match_returns_404() -> None:
    response = client.get(
        "/api/matches/unknown/explain",
        headers={"Authorization": f"Bearer {login()}"},
    )
    assert response.status_code == 404


def test_data_routes_require_authentication() -> None:
    response = client.get("/api/evidence")
    assert response.status_code == 401
