import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SectionHeading } from "./shared";

const stats = [{ value: 4, label: "Featured projects" }, { value: 4, label: "Service areas" }, { value: 4, label: "Part primary stack" }];

export function About() { return <section id="about" className="section section-muted"><div className="container grid gap-10 lg:grid-cols-[1fr,0.75fr]"><div><SectionHeading eyebrow="04 / About" title="Practical full-stack work, from interface to API.">I’m Hriday Saluja, a BCA student at Jagannath University and a Delhi-based developer. I build useful web applications across React interfaces, FastAPI and Spring Boot services, databases, and deployment. I’m looking for full-stack and software-development opportunities, internships, and focused freelance projects.</SectionHeading><div className="about-stats" aria-label="Portfolio overview">{stats.map((stat) => <Counter key={stat.label} {...stat} />)}</div></div><div className="about-stack glass-card"><p className="eyebrow">Primary toolkit</p><ul><li>React.js and TypeScript interfaces</li><li>FastAPI and Spring Boot APIs</li><li>PostgreSQL, MySQL, and MongoDB data layers</li><li>GitHub, Vercel, Docker, and production delivery</li></ul></div></div></section>; }

function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null); const reducedMotion = useReducedMotion(); const [current, setCurrent] = useState(reducedMotion ? value : 0);
  useEffect(() => { if (reducedMotion || typeof IntersectionObserver === "undefined") { setCurrent(value); return; } const target = ref.current; if (!target) return; const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) return; const start = performance.now(); const tick = (time: number) => { const progress = Math.min(1, (time - start) / 650); setCurrent(Math.round(value * progress)); if (progress < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); observer.disconnect(); }, { threshold: .45 }); observer.observe(target); return () => observer.disconnect(); }, [reducedMotion, value]);
  return <div ref={ref} className="about-stat"><strong>{current}</strong><span>{label}</span></div>;
}
