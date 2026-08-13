import asyncio
import smtplib
from collections import defaultdict, deque
from datetime import datetime, timezone
from email.message import EmailMessage
from time import monotonic

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from projects import PROJECTS, Project


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    cors_origins: str = "http://localhost:5173"
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_pass: str | None = None
    to_email: EmailStr | None = None
    rate_limit_max_requests: int = Field(default=5, ge=1, le=100)
    rate_limit_window_seconds: int = Field(default=900, ge=1, le=86_400)

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def smtp_ready(self) -> bool:
        return all((self.smtp_host, self.smtp_user, self.smtp_pass, self.to_email))


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


class ContactRateLimiter:
    def __init__(self) -> None:
        self.requests: defaultdict[str, deque[float]] = defaultdict(deque)

    def allow(self, client_ip: str, max_requests: int, window_seconds: int) -> bool:
        now = monotonic()
        attempts = self.requests[client_ip]
        while attempts and attempts[0] <= now - window_seconds:
            attempts.popleft()
        if len(attempts) >= max_requests:
            return False
        attempts.append(now)
        return True


rate_limiter = ContactRateLimiter()
app = FastAPI(title="Hriday Portfolio API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


def send_contact_email(contact: ContactRequest) -> None:
    message = EmailMessage()
    message["Subject"] = f"Portfolio contact from {contact.name}"
    message["From"] = settings.smtp_user
    message["To"] = str(settings.to_email)
    message["Reply-To"] = str(contact.email)
    message.set_content(
        f"Name: {contact.name}\\nEmail: {contact.email}\\n\\nMessage:\\n{contact.message}"
    )
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
        server.starttls()
        server.login(settings.smtp_user, settings.smtp_pass)
        server.send_message(message)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.get("/api/projects", response_model=list[Project])
def get_projects() -> list[Project]:
    return PROJECTS


@app.post("/api/contact", response_model=ContactResponse)
async def contact(payload: ContactRequest, request: Request) -> ContactResponse:
    client_ip = request.client.host if request.client else "unknown"
    if not rate_limiter.allow(
        client_ip, settings.rate_limit_max_requests, settings.rate_limit_window_seconds
    ):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many messages. Please try again later.",
        )
    if not settings.smtp_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Contact email is not configured yet. Please email Hriday directly.",
        )
    try:
        await asyncio.to_thread(send_contact_email, payload)
    except (OSError, smtplib.SMTPException):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Message delivery failed. Please try again or email Hriday directly.",
        ) from None
    return ContactResponse(success=True, message="Thanks! Your message has been sent.")
