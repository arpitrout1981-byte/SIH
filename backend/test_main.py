from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_profile_uses_admin_name() -> None:
    response = client.get("/api/profile")
    assert response.status_code == 200
    assert response.json()["name"] == "Admin"


def test_explanation_is_evidence_based() -> None:
    response = client.get("/api/matches/m1/explain")
    body = response.json()
    assert response.status_code == 200
    assert body["matched_skills"] == ["SQL", "Data Visualization", "Python"]
    assert body["gaps"][0]["skill"] == "Statistical Modeling"
    assert "excluded" in body["fairness_note"]


def test_missing_match_returns_404() -> None:
    response = client.get("/api/matches/unknown/explain")
    assert response.status_code == 404
