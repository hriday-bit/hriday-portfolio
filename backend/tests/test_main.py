import bcrypt
from fastapi.testclient import TestClient

import main


client = TestClient(main.app, base_url="https://testserver")
payload = {"name": "Ada Lovelace", "email": "ada@example.com", "message": "I would like to discuss a project."}


def setup_function() -> None:
    main.rate_limiter.requests.clear()
    main.login_rate_limiter.requests.clear()
    main.store.submissions.clear()
    main.store.next_submission_id = 1
    client.cookies.clear()


def test_health_and_projects() -> None:
    assert client.get("/api/health").status_code == 200
    projects = client.get("/api/projects").json()
    assert len(projects) == 4
    assert {"id", "title", "description", "tech", "githubUrl", "liveUrl", "featured"} <= set(projects[0])


def test_contact_validation() -> None:
    response = client.post("/api/contact", json={**payload, "name": ""})
    assert response.status_code == 422


def test_contact_persists_without_email_configuration() -> None:
    response = client.post("/api/contact", json={"name": payload["name"], "message": payload["message"]})
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert "saved" in response.json()["message"]
    assert len(main.store.submissions) == 1


def test_contact_rate_limit(monkeypatch) -> None:
    monkeypatch.setattr(main.settings, "rate_limit_max_requests", 1)
    assert client.post("/api/contact", json=payload).status_code == 200
    assert client.post("/api/contact", json=payload).status_code == 429


def test_cors_preflight() -> None:
    response = client.options(
        "/api/contact",
        headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST"},
    )
    assert response.status_code == 200


def login_as_admin(monkeypatch) -> None:
    monkeypatch.setattr(main.settings, "admin_username", "hriday")
    monkeypatch.setattr(main.settings, "admin_password_hash", bcrypt.hashpw(b"correct-password", bcrypt.gensalt()).decode())
    monkeypatch.setattr(main.settings, "jwt_secret", "test-secret")
    response = client.post("/api/admin/login", json={"username": "hriday", "password": "correct-password"})
    assert response.status_code == 200
    assert "HttpOnly" in response.headers["set-cookie"]


def test_admin_login_and_protected_routes(monkeypatch) -> None:
    assert client.get("/api/admin/submissions").status_code == 401
    login_as_admin(monkeypatch)
    assert client.get("/api/admin/session").json() == {"authenticated": True}
    assert client.get("/api/admin/submissions").status_code == 200


def test_admin_login_rejects_bad_password(monkeypatch) -> None:
    monkeypatch.setattr(main.settings, "admin_username", "hriday")
    monkeypatch.setattr(main.settings, "admin_password_hash", bcrypt.hashpw(b"correct-password", bcrypt.gensalt()).decode())
    monkeypatch.setattr(main.settings, "jwt_secret", "test-secret")
    assert client.post("/api/admin/login", json={"username": "hriday", "password": "wrong"}).status_code == 401


def test_admin_project_crud_preserves_public_shape(monkeypatch) -> None:
    login_as_admin(monkeypatch)
    project = {"id": "admin-test-project", "title": "Admin test", "problem": "A problem", "solution": "A solution", "result": "A result", "tech": ["React"], "githubUrl": "https://github.com/hriday-bit/admin-test", "liveUrl": "", "featured": False, "sortOrder": 10}
    assert client.post("/api/admin/projects", json=project).status_code == 201
    project["title"] = "Updated admin test"
    assert client.patch("/api/admin/projects/admin-test-project", json=project).status_code == 200
    public = client.get("/api/projects").json()
    item = next(value for value in public if value["id"] == "admin-test-project")
    assert set(item) == {"id", "title", "description", "tech", "githubUrl", "liveUrl", "featured"}
    assert client.delete("/api/admin/projects/admin-test-project").status_code == 204
