from fastapi.testclient import TestClient

import main


client = TestClient(main.app)
payload = {"name": "Ada Lovelace", "email": "ada@example.com", "message": "I would like to discuss a project."}


def setup_function() -> None:
    main.rate_limiter.requests.clear()


def test_health_and_projects() -> None:
    assert client.get("/api/health").status_code == 200
    projects = client.get("/api/projects").json()
    assert len(projects) == 4
    assert {"id", "title", "description", "tech", "githubUrl", "liveUrl", "featured"} <= set(projects[0])


def test_contact_validation() -> None:
    response = client.post("/api/contact", json={**payload, "email": "invalid"})
    assert response.status_code == 422


def test_contact_requires_smtp(monkeypatch) -> None:
    monkeypatch.setattr(main.settings, "smtp_host", None)
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 503


def test_contact_sends_email(monkeypatch) -> None:
    monkeypatch.setattr(main.settings, "smtp_host", "smtp.example.com")
    monkeypatch.setattr(main.settings, "smtp_user", "sender@example.com")
    monkeypatch.setattr(main.settings, "smtp_pass", "secret")
    monkeypatch.setattr(main.settings, "to_email", "recipient@example.com")
    monkeypatch.setattr(main, "send_contact_email", lambda _: None)
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_contact_rate_limit(monkeypatch) -> None:
    monkeypatch.setattr(main.settings, "smtp_host", "smtp.example.com")
    monkeypatch.setattr(main.settings, "smtp_user", "sender@example.com")
    monkeypatch.setattr(main.settings, "smtp_pass", "secret")
    monkeypatch.setattr(main.settings, "to_email", "recipient@example.com")
    monkeypatch.setattr(main, "send_contact_email", lambda _: None)
    monkeypatch.setattr(main.settings, "rate_limit_max_requests", 1)
    assert client.post("/api/contact", json=payload).status_code == 200
    assert client.post("/api/contact", json=payload).status_code == 429


def test_cors_preflight() -> None:
    response = client.options(
        "/api/contact",
        headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST"},
    )
    assert response.status_code == 200
