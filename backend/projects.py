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
            "Problem: Dating platforms can make meaningful matching feel impersonal. "
            "Solution: Built a premium AI-powered experience for compatibility and trust. "
            "Result: A focused foundation for more intentional conversations."
        ),
        tech=["React", "TypeScript", "AI integration"],
        githubUrl="https://github.com/hriday-bit/lovelens-ai",
    ),
    Project(
        id="solar-website",
        title="Solar Website (Rishabh Enterprises)",
        description=(
            "Problem: A solar panel and battery business needed a credible online presence. "
            "Solution: Delivered a responsive website with animations and WhatsApp-based inquiries. "
            "Result: A live lead channel ready for production customers."
        ),
        tech=["React", "FastAPI", "PostgreSQL"],
        githubUrl="https://github.com/hriday-bit/solar-website",
        liveUrl="https://solar-website-api-server.vercel.app/",
    ),
    Project(
        id="student-attendance-system",
        title="Student Attendance System",
        description=(
            "Problem: Manual attendance tracking is difficult to manage and review. "
            "Solution: Built a JWT-secured system with focused REST modules. "
            "Result: A clearer digital workflow for student attendance records."
        ),
        tech=["Spring Boot", "Vue 3", "MySQL"],
        githubUrl="https://github.com/hriday-bit/Student-Attendance-System",
    ),
    Project(
        id="uk-payroll-calculator",
        title="UK Payroll Calculator",
        description=(
            "Problem: Weekly pay calculations involve deductions, overtime, and expenses. "
            "Solution: Built a dedicated payroll calculator with transparent inputs. "
            "Result: Consistent, easier-to-review worker pay calculations."
        ),
        tech=["NestJS", "Next.js", "Prisma"],
        githubUrl="https://github.com/hriday-bit/uk-payroll-calculator",
    ),
]
