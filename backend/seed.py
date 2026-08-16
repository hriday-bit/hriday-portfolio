from __future__ import annotations

from database import Base, ProjectRecord, SiteContent, create_session_factory
from projects import PROJECTS


DEFAULT_CONTENT = {
    "availability": "Open to full-time full-stack opportunities and available for select freelance projects.",
    "services": [
        {"title": "Business Websites", "description": "Responsive, conversion-focused sites that give your business a credible home online.", "icon": "globe"},
        {"title": "Full-Stack Web Apps", "description": "Useful interfaces and dependable APIs shaped around real product workflows.", "icon": "code"},
        {"title": "API & Backend Development", "description": "Clean, documented backend services that keep your product moving securely.", "icon": "server"},
        {"title": "Startup MVPs", "description": "Focused first versions that help founders validate ideas and learn quickly.", "icon": "rocket"},
    ],
    "testimonial": {"quote": "Placeholder: Add a short client note about the collaboration, communication, and outcome.", "name": "Client name", "role": "Client role"},
}


def story(description: str) -> tuple[str, str, str]:
    parts = description.replace("Problem: ", "").replace("Solution: ", "|").replace("Result: ", "|").split("|")
    return tuple(part.strip() for part in parts)  # type: ignore[return-value]


def seed(database_url: str) -> None:
    engine, session_factory = create_session_factory(database_url)
    Base.metadata.create_all(engine)
    with session_factory() as session:
        for index, project in enumerate(PROJECTS):
            if not session.get(ProjectRecord, project.id):
                problem, solution, result = story(project.description)
                session.add(ProjectRecord(id=project.id, title=project.title, problem=problem, solution=solution, result=result, tech=project.tech, github_url=str(project.githubUrl), live_url=project.liveUrl, featured=project.featured, sort_order=index))
        for key, value in DEFAULT_CONTENT.items():
            if not session.get(SiteContent, key):
                session.add(SiteContent(key=key, value=value))
        session.commit()


if __name__ == "__main__":
    from main import settings
    if not settings.database_url:
        raise SystemExit("DATABASE_URL is required to seed PostgreSQL.")
    seed(settings.database_url)
