import type { Project } from "./types";

export const fallbackProjects: Project[] = [
  { id: "lovelens-ai", title: "LoveLens AI", description: "A premium AI-powered dating platform focused on intelligent matching, compatibility, trust, and meaningful conversations.", tech: ["React", "TypeScript", "AI integration"], githubUrl: "https://github.com/hriday-bit/lovelens-ai", liveUrl: "", featured: true },
  { id: "solar-website", title: "Solar Website (Rishabh Enterprises)", description: "A freelance production business website with responsive layouts, scroll animations, WhatsApp integration, and contact functionality.", tech: ["React", "FastAPI", "PostgreSQL"], githubUrl: "https://github.com/hriday-bit/solar-website", liveUrl: "", featured: true },
  { id: "student-attendance-system", title: "Student Attendance System", description: "A full-stack college project to digitally manage attendance with JWT auth and multiple REST API modules.", tech: ["Spring Boot", "Vue 3", "MySQL"], githubUrl: "https://github.com/hriday-bit/Student-Attendance-System", liveUrl: "", featured: true },
  { id: "uk-payroll-calculator", title: "UK Payroll Calculator", description: "Calculates weekly worker pay including CIS tax deductions, overtime, materials, expenses, and advance repayments.", tech: ["NestJS", "Next.js", "Prisma"], githubUrl: "https://github.com/hriday-bit/uk-payroll-calculator", liveUrl: "", featured: true },
];
