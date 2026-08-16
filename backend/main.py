from __future__ import annotations

from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone
from time import monotonic
from typing import Any, Literal

import bcrypt
import jwt
from fastapi import Cookie, Depends, FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import ContactSubmission, ProjectRecord, SiteContent, create_session_factory
from projects import PROJECTS, Project
from seed import DEFAULT_CONTENT


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    cors_origins: str = "http://localhost:5173"
    database_url: str | None = None
    rate_limit_max_requests: int = Field(default=5, ge=1, le=100)
    rate_limit_window_seconds: int = Field(default=900, ge=1, le=86_400)
    admin_username: str | None = None
    admin_password_hash: str | None = None
    jwt_secret: str | None = None
    jwt_expires_minutes: int = Field(default=480, ge=5, le=1_440)
    admin_rate_limit_max_requests: int = Field(default=5, ge=1, le=100)
    admin_rate_limit_window_seconds: int = Field(default=900, ge=1, le=86_400)

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip().rstrip("/") for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def admin_ready(self) -> bool:
        return all((self.admin_username, self.admin_password_hash, self.jwt_secret))


settings = Settings()


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    message: str = Field(min_length=10, max_length=5000)

    @field_validator("name", "message")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank.")
        return value


class ContactResponse(BaseModel):
    success: bool
    message: str


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=1, max_length=500)


class SubmissionResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    message: str
    status: Literal["new", "read", "replied"]
    createdAt: datetime


class SubmissionUpdate(BaseModel):
    status: Literal["new", "read", "replied"]


class AdminProject(BaseModel):
    id: str = Field(pattern=r"^[a-z0-9-]{2,120}$")
    title: str = Field(min_length=2, max_length=160)
    problem: str = Field(min_length=2, max_length=2000)
    solution: str = Field(min_length=2, max_length=2000)
    result: str = Field(min_length=2, max_length=2000)
    tech: list[str] = Field(min_length=1, max_length=20)
    githubUrl: str = Field(min_length=8, max_length=500)
    liveUrl: str = Field(default="", max_length=500)
    featured: bool = True
    sortOrder: int = Field(default=0, ge=0, le=999)


class ProjectOrder(BaseModel):
    ids: list[str] = Field(min_length=1, max_length=100)


class ContentPayload(BaseModel):
    availability: str = Field(min_length=5, max_length=500)
    services: list[dict[str, str]] = Field(min_length=3, max_length=4)
    testimonial: dict[str, str]


class RateLimiter:
    def __init__(self) -> None:
        self.requests: defaultdict[str, deque[float]] = defaultdict(deque)

    def allow(self, key: str, max_requests: int, window_seconds: int) -> bool:
        now = monotonic(); attempts = self.requests[key]
        while attempts and attempts[0] <= now - window_seconds: attempts.popleft()
        if len(attempts) >= max_requests: return False
        attempts.append(now); return True


def _story(description: str) -> tuple[str, str, str]:
    parts = description.replace("Problem: ", "").replace("Solution: ", "|").replace("Result: ", "|").split("|")
    return tuple(part.strip() for part in parts)  # type: ignore[return-value]


class InMemoryStore:
    """Development/test fallback. Render always receives DATABASE_URL."""
    def __init__(self) -> None:
        self.projects: dict[str, AdminProject] = {}
        for index, project in enumerate(PROJECTS):
            problem, solution, result = _story(project.description)
            self.projects[project.id] = AdminProject(id=project.id, title=project.title, problem=problem, solution=solution, result=result, tech=project.tech, githubUrl=str(project.githubUrl), liveUrl=project.liveUrl, featured=project.featured, sortOrder=index)
        self.content: dict[str, Any] = {key: value.copy() if isinstance(value, dict) else [item.copy() for item in value] if isinstance(value, list) else value for key, value in DEFAULT_CONTENT.items()}
        self.submissions: list[SubmissionResponse] = []
        self.next_submission_id = 1


store = InMemoryStore()
engine = session_factory = None
if settings.database_url: engine, session_factory = create_session_factory(settings.database_url)
contact_rate_limiter = RateLimiter(); login_rate_limiter = RateLimiter()
# Backwards-compatible name used by existing contact-rate-limit tests.
rate_limiter = contact_rate_limiter
app = FastAPI(title="Hriday Portfolio API", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins, allow_credentials=True, allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"], allow_headers=["Content-Type"])


def _description(record: ProjectRecord | AdminProject) -> str:
    return f"Problem: {record.problem} Solution: {record.solution} Result: {record.result}"


def _public_project(record: ProjectRecord | AdminProject) -> Project:
    return Project(id=record.id, title=record.title, description=_description(record), tech=record.tech, githubUrl=record.github_url if isinstance(record, ProjectRecord) else record.githubUrl, liveUrl=record.live_url if isinstance(record, ProjectRecord) else record.liveUrl, featured=record.featured)


def _admin_project(record: ProjectRecord | AdminProject) -> AdminProject:
    if isinstance(record, AdminProject): return record
    return AdminProject(id=record.id, title=record.title, problem=record.problem, solution=record.solution, result=record.result, tech=record.tech, githubUrl=record.github_url, liveUrl=record.live_url, featured=record.featured, sortOrder=record.sort_order)


def get_db():
    if not session_factory:
        yield None; return
    db = session_factory()
    try: yield db
    finally: db.close()


def require_admin(admin_token: str | None = Cookie(default=None, alias="admin_token")) -> dict[str, Any]:
    if not settings.admin_ready or not admin_token: raise HTTPException(401, "Authentication required.")
    try:
        payload = jwt.decode(admin_token, settings.jwt_secret, algorithms=["HS256"])
        if payload.get("sub") != settings.admin_username: raise jwt.InvalidTokenError
        return payload
    except jwt.PyJWTError: raise HTTPException(401, "Authentication required.") from None


def require_same_origin(request: Request) -> None:
    origin = request.headers.get("origin")
    if origin and origin.rstrip("/") not in settings.allowed_origins: raise HTTPException(403, "Request origin is not allowed.")


def persist_contact(payload: ContactRequest, db: Session | None) -> None:
    if db:
        db.add(ContactSubmission(name=payload.name, email=str(payload.email), message=payload.message)); db.commit()
    else:
        store.submissions.append(SubmissionResponse(id=store.next_submission_id, name=payload.name, email=payload.email, message=payload.message, status="new", createdAt=datetime.now(timezone.utc))); store.next_submission_id += 1


@app.get("/api/health")
def health() -> dict[str, str]: return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.get("/api/projects", response_model=list[Project])
def get_projects(db: Session | None = Depends(get_db)) -> list[Project]:
    records = db.scalars(select(ProjectRecord).order_by(ProjectRecord.sort_order)).all() if db else sorted(store.projects.values(), key=lambda item: item.sortOrder)
    return [_public_project(record) for record in records]


@app.get("/api/content", response_model=ContentPayload)
def get_content(db: Session | None = Depends(get_db)) -> ContentPayload:
    if not db: return ContentPayload(**store.content)
    values = {item.key: item.value for item in db.scalars(select(SiteContent)).all()}
    return ContentPayload(**{key: values.get(key, value) for key, value in DEFAULT_CONTENT.items()})


@app.post("/api/contact", response_model=ContactResponse)
def contact(payload: ContactRequest, request: Request, db: Session | None = Depends(get_db)) -> ContactResponse:
    client_ip = request.client.host if request.client else "unknown"
    if not contact_rate_limiter.allow(client_ip, settings.rate_limit_max_requests, settings.rate_limit_window_seconds): raise HTTPException(429, "Too many messages. Please try again later.")
    persist_contact(payload, db)
    return ContactResponse(success=True, message="Thanks! Your message has been saved.")


@app.post("/api/admin/login")
def login(payload: LoginRequest, request: Request, response: Response) -> dict[str, bool]:
    client_ip = request.client.host if request.client else "unknown"
    if not login_rate_limiter.allow(client_ip, settings.admin_rate_limit_max_requests, settings.admin_rate_limit_window_seconds): raise HTTPException(429, "Too many login attempts. Please try again later.")
    valid = settings.admin_ready and payload.username == settings.admin_username and bcrypt.checkpw(payload.password.encode(), settings.admin_password_hash.encode())
    if not valid: raise HTTPException(401, "Invalid username or password.")
    expires = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expires_minutes)
    token = jwt.encode({"sub": settings.admin_username, "exp": expires}, settings.jwt_secret, algorithm="HS256")
    response.set_cookie("admin_token", token, httponly=True, secure=True, samesite="lax", max_age=settings.jwt_expires_minutes * 60, path="/api/admin")
    return {"success": True}


@app.post("/api/admin/logout", status_code=204)
def logout(response: Response, _: dict[str, Any] = Depends(require_admin)) -> None: response.delete_cookie("admin_token", path="/api/admin", secure=True, httponly=True, samesite="lax")


@app.get("/api/admin/session")
def session(_: dict[str, Any] = Depends(require_admin)) -> dict[str, bool]: return {"authenticated": True}


@app.get("/api/admin/submissions", response_model=list[SubmissionResponse])
def list_submissions(status_filter: Literal["new", "read", "replied"] | None = None, db: Session | None = Depends(get_db), _: dict[str, Any] = Depends(require_admin)) -> list[SubmissionResponse]:
    if db:
        query = select(ContactSubmission).order_by(ContactSubmission.created_at.desc())
        if status_filter: query = query.where(ContactSubmission.status == status_filter)
        return [SubmissionResponse(id=item.id, name=item.name, email=item.email, message=item.message, status=item.status, createdAt=item.created_at) for item in db.scalars(query).all()]
    return [item for item in store.submissions if not status_filter or item.status == status_filter]


@app.patch("/api/admin/submissions/{submission_id}", response_model=SubmissionResponse)
def update_submission(submission_id: int, payload: SubmissionUpdate, request: Request, db: Session | None = Depends(get_db), _: dict[str, Any] = Depends(require_admin)) -> SubmissionResponse:
    require_same_origin(request)
    if db:
        item = db.get(ContactSubmission, submission_id)
        if not item: raise HTTPException(404, "Submission not found.")
        item.status = payload.status; db.commit(); db.refresh(item)
        return SubmissionResponse(id=item.id, name=item.name, email=item.email, message=item.message, status=item.status, createdAt=item.created_at)
    for item in store.submissions:
        if item.id == submission_id: item.status = payload.status; return item
    raise HTTPException(404, "Submission not found.")


@app.get("/api/admin/projects", response_model=list[AdminProject])
def admin_projects(db: Session | None = Depends(get_db), _: dict[str, Any] = Depends(require_admin)) -> list[AdminProject]:
    records = db.scalars(select(ProjectRecord).order_by(ProjectRecord.sort_order)).all() if db else sorted(store.projects.values(), key=lambda item: item.sortOrder)
    return [_admin_project(item) for item in records]


@app.post("/api/admin/projects", response_model=AdminProject, status_code=201)
def create_project(payload: AdminProject, request: Request, db: Session | None = Depends(get_db), _: dict[str, Any] = Depends(require_admin)) -> AdminProject:
    require_same_origin(request)
    if db:
        if db.get(ProjectRecord, payload.id): raise HTTPException(409, "A project with this ID already exists.")
        record = ProjectRecord(id=payload.id, title=payload.title, problem=payload.problem, solution=payload.solution, result=payload.result, tech=payload.tech, github_url=payload.githubUrl, live_url=payload.liveUrl, featured=payload.featured, sort_order=payload.sortOrder); db.add(record); db.commit(); return _admin_project(record)
    if payload.id in store.projects: raise HTTPException(409, "A project with this ID already exists.")
    store.projects[payload.id] = payload; return payload


@app.patch("/api/admin/projects/{project_id}", response_model=AdminProject)
def edit_project(project_id: str, payload: AdminProject, request: Request, db: Session | None = Depends(get_db), _: dict[str, Any] = Depends(require_admin)) -> AdminProject:
    require_same_origin(request)
    if payload.id != project_id: raise HTTPException(400, "Project ID cannot be changed.")
    if db:
        record = db.get(ProjectRecord, project_id)
        if not record: raise HTTPException(404, "Project not found.")
        for field, value in {"title": payload.title, "problem": payload.problem, "solution": payload.solution, "result": payload.result, "tech": payload.tech, "github_url": payload.githubUrl, "live_url": payload.liveUrl, "featured": payload.featured, "sort_order": payload.sortOrder}.items(): setattr(record, field, value)
        db.commit(); return _admin_project(record)
    if project_id not in store.projects: raise HTTPException(404, "Project not found.")
    store.projects[project_id] = payload; return payload


@app.delete("/api/admin/projects/{project_id}", status_code=204)
def delete_project(project_id: str, request: Request, db: Session | None = Depends(get_db), _: dict[str, Any] = Depends(require_admin)) -> None:
    require_same_origin(request)
    if db:
        record = db.get(ProjectRecord, project_id)
        if not record: raise HTTPException(404, "Project not found.")
        db.delete(record); db.commit(); return
    if not store.projects.pop(project_id, None): raise HTTPException(404, "Project not found.")


@app.patch("/api/admin/projects/reorder", response_model=list[AdminProject])
def reorder_projects(payload: ProjectOrder, request: Request, db: Session | None = Depends(get_db), _: dict[str, Any] = Depends(require_admin)) -> list[AdminProject]:
    require_same_origin(request)
    if len(set(payload.ids)) != len(payload.ids): raise HTTPException(400, "Project order contains duplicates.")
    if db:
        records = {item.id: item for item in db.scalars(select(ProjectRecord).where(ProjectRecord.id.in_(payload.ids))).all()}
        if len(records) != len(payload.ids): raise HTTPException(400, "Project order contains an unknown project.")
        for order, project_id in enumerate(payload.ids): records[project_id].sort_order = order
        db.commit(); return [_admin_project(records[project_id]) for project_id in payload.ids]
    if set(payload.ids) != set(store.projects): raise HTTPException(400, "Project order must include every project.")
    for order, project_id in enumerate(payload.ids): store.projects[project_id].sortOrder = order
    return [store.projects[project_id] for project_id in payload.ids]


@app.get("/api/admin/content", response_model=ContentPayload)
def admin_content(db: Session | None = Depends(get_db), _: dict[str, Any] = Depends(require_admin)) -> ContentPayload: return get_content(db)


@app.patch("/api/admin/content", response_model=ContentPayload)
def update_content(payload: ContentPayload, request: Request, db: Session | None = Depends(get_db), _: dict[str, Any] = Depends(require_admin)) -> ContentPayload:
    require_same_origin(request); values = payload.model_dump()
    if db:
        for key, value in values.items():
            record = db.get(SiteContent, key)
            if record: record.value = value
            else: db.add(SiteContent(key=key, value=value))
        db.commit()
    else: store.content = values
    return payload
