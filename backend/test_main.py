import os
from pathlib import Path
from tempfile import TemporaryDirectory


def test_api_lifecycle() -> None:
    with TemporaryDirectory(ignore_cleanup_errors=True) as directory:
        os.environ["SKILLFOLIO_DB_PATH"] = str(Path(directory) / "test.db")
        from fastapi.testclient import TestClient
        from backend.main import app

        with TestClient(app) as client:
            signup = client.post(
                "/api/auth/signup",
                json={"email": "yash@example.com", "password": "strong-password", "name": "Yash"},
            )
            assert signup.status_code == 201
            token = signup.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            assert client.get("/api/profile", headers=headers).json()["name"] == "Yash"
            assert client.get("/api/evidence", headers=headers).json() == []
            assert client.get("/api/recommendations", headers=headers).status_code == 200

            evidence = client.post(
                "/api/evidence",
                headers=headers,
                json={
                    "title": "Python course",
                    "type": "course",
                    "source": "University",
                    "date": "2026-08-22",
                    "skills": ["Python"],
                    "detail": "Completed with distinction",
                },
            )
            assert evidence.status_code == 201
            assert len(client.get("/api/evidence", headers=headers).json()) == 1

            vacancies = client.get("/api/vacancies", headers=headers)
            assert vacancies.status_code == 200
            assert vacancies.json()

            second = client.post(
                "/api/auth/signup",
                json={"email": "second@example.com", "password": "strong-password", "name": "Second"},
            )
            second_headers = {"Authorization": f"Bearer {second.json()['access_token']}"}
            assert client.get("/api/evidence", headers=second_headers).json() == []

            assert client.post("/api/auth/logout", headers=headers).status_code == 200
            assert client.get("/api/profile", headers=headers).status_code == 401
