from typing import Final

from pydantic import BaseModel, HttpUrl


class Project(BaseModel):
    id: str
    title: str
    description: str
    tech: list[str]
    githubUrl: HttpUrl
    liveUrl: str = ""
    featured: bool = True


PROJECTS: Final[list[Project]] = [
    Project(
        id="lovelens-ai",
        title="LoveLens AI",
        description=(
            "A premium AI-powered dating platform built around intelligent matching, "
            "compatibility, trust, and meaningful conversations."
        ),
        tech=["React", "TypeScript", "AI integration"],
        githubUrl="https://github.com/hriday-bit/lovelens-ai",
    ),
    Project(
        id="solar-website",
        title="Solar Website (Rishabh Enterprises)",
        description=(
            "A freelance production website for a solar business with responsive layouts, "
            "scroll animations, WhatsApp integration, and contact functionality."
        ),
        tech=["React", "FastAPI", "PostgreSQL"],
        githubUrl="https://github.com/hriday-bit/solar-website",
    ),
    Project(
        id="student-attendance-system",
        title="Student Attendance System",
        description=(
            "A full-stack college project for digitally managing student attendance, "
            "with JWT authentication and multiple REST API modules."
        ),
        tech=["Spring Boot", "Vue 3", "MySQL"],
        githubUrl="https://github.com/hriday-bit/Student-Attendance-System",
    ),
    Project(
        id="uk-payroll-calculator",
        title="UK Payroll Calculator",
        description=(
            "A payroll calculator for weekly worker pay, including CIS deductions, "
            "overtime, materials, expenses, and advance repayments."
        ),
        tech=["NestJS", "Next.js", "Prisma"],
        githubUrl="https://github.com/hriday-bit/uk-payroll-calculator",
    ),
]
