import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { fallbackProjects } from "../data";
import type { Project } from "../types";
import { SectionHeading } from "./shared";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:8000" : "");
const highlights: Record<string, string[]> = { "lovelens-ai": ["React and TypeScript product interface", "AI integration for compatibility-focused product features"], "solar-website": ["Responsive React interface with scroll animations", "WhatsApp-based inquiry path and production deployment"], "student-attendance-system": ["JWT authentication and multiple REST API modules", "Vue 3 frontend with Spring Boot and MySQL"], "uk-payroll-calculator": ["Weekly pay workflows for deductions, overtime, and expenses", "Next.js and NestJS application architecture with Prisma"] };

function useProjects() { const [projects, setProjects] = useState<Project[]>(fallbackProjects); useEffect(() => { const controller = new AbortController(); fetch(`${API_BASE_URL}/api/projects`, { signal: controller.signal }).then((response) => response.ok ? response.json() : Promise.reject()).then((data: Project[]) => Array.isArray(data) && setProjects(data)).catch(() => undefined); return () => controller.abort(); }, []); return projects; }
export function projectStory(description: string) { const values = description.replace("Problem: ", "").replace("Solution: ", "|").replace("Result: ", "|").split("|").map((item) => item.trim()); return { problem: values[0] ?? description, solution: values[1] ?? "", outcome: values[2] ?? "" }; }

export function Projects() {
  const projects = useProjects(); const reducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null); const trackRef = useRef<HTMLDivElement>(null);
  const [eligible, setEligible] = useState(false); const [filmstripReady, setFilmstripReady] = useState(false);
  const visibleProjects = projects.filter((project) => project.featured);

  useEffect(() => {
    if (reducedMotion || !viewportRef.current || typeof IntersectionObserver === "undefined" || typeof window.matchMedia !== "function") return;
    const desktop = window.matchMedia("(min-width: 1024px)"); if (!desktop.matches) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setEligible(true); observer.disconnect(); } }, { rootMargin: "320px 0px" });
    const onChange = () => {
      if (!desktop.matches) { setEligible(false); return; }
      if (viewportRef.current) observer.observe(viewportRef.current);
    };
    desktop.addEventListener("change", onChange);
    observer.observe(viewportRef.current); return () => { observer.disconnect(); desktop.removeEventListener("change", onChange); };
  }, [reducedMotion]);

  useEffect(() => {
    if (!eligible || !viewportRef.current || !trackRef.current) return;
    let active = true; let frame = 0; let context: { revert: () => void } | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([core, plugin]) => {
      if (!active || !viewportRef.current || !trackRef.current) return;
      const gsap = core.gsap; gsap.registerPlugin(plugin.ScrollTrigger); setFilmstripReady(true);
      frame = window.requestAnimationFrame(() => {
        if (!active || !viewportRef.current || !trackRef.current) return;
        context = gsap.context(() => {
          const cards = gsap.utils.toArray<HTMLElement>(".project-card", trackRef.current);
          const overflow = trackRef.current!.scrollWidth - viewportRef.current!.clientWidth;
          if (cards.length < 2 || overflow <= 0) { setFilmstripReady(false); return; }
          const setActive = (index: number) => cards.forEach((card, cardIndex) => card.classList.toggle("project-card-active", cardIndex === index));
          setActive(0);
          gsap.timeline({ scrollTrigger: { trigger: viewportRef.current, start: "top 18%", end: `+=${Math.max(1500, Math.round(overflow * 1.35))}`, pin: true, scrub: .7, anticipatePin: 1, onUpdate: (self) => setActive(Math.round(self.progress * (cards.length - 1)))} }).to(trackRef.current, { x: -overflow, duration: 1, ease: "none" });
        }, viewportRef);
      });
    }).catch(() => setFilmstripReady(false));
    return () => { active = false; if (frame) window.cancelAnimationFrame(frame); context?.revert(); setFilmstripReady(false); };
  }, [eligible, visibleProjects.length]);

  const focusCard = (event: React.FocusEvent<HTMLDivElement>) => { const card = (event.target as HTMLElement).closest<HTMLElement>(".project-card"); if (card) trackRef.current?.querySelectorAll(".project-card").forEach((item) => item.classList.toggle("project-card-active", item === card)); };
  return <section id="projects" className="section projects-section"><div className="container"><SectionHeading eyebrow="02 / Projects" title="Engineering work, explained clearly.">Selected applications with the context, implementation, and proof behind each build.</SectionHeading><div ref={viewportRef} className={`projects-viewport${filmstripReady ? " projects-filmstrip-enabled" : ""}`}><div ref={trackRef} onFocusCapture={focusCard} className={filmstripReady ? "projects-filmstrip" : "projects-grid grid gap-5 md:grid-cols-2"}>{visibleProjects.map((project, index) => <ProjectCard project={project} index={index} key={project.id} />)}</div></div></div></section>;
}

function ProjectCard({ project, index }: { project: Project; index: number }) { const reducedMotion = useReducedMotion(); const caseStudy = projectStory(project.description); const isSolar = project.id === "solar-website"; return <motion.article className={`project-card glass-card ${isSolar ? "project-card-featured" : ""}`} initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: index * 0.07, duration: 0.35 }}><span className="project-number">0{index + 1}</span>{isSolar && <div className="work-labels"><span>Client Work</span><span>Production</span></div>}<h3>{project.title}</h3><div className="project-case"><section><h4>Problem</h4><p>{caseStudy.problem}</p></section><section><h4>Solution</h4><p>{caseStudy.solution}</p></section><section><h4>Implementation / outcome</h4><p>{caseStudy.outcome}</p></section></div><section className="project-highlights"><h4>Engineering highlights</h4><ul>{(highlights[project.id] ?? ["Implemented a focused application workflow using the listed technology stack."]).map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></section><div className="mt-6 flex flex-wrap gap-2">{project.tech.map((tech) => <span className="tech-badge" key={tech}>{tech}</span>)}</div><div className="mt-8 flex flex-wrap gap-4"><a className="text-link" href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub <FaGithub /></a>{project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live demo <FaExternalLinkAlt /></a>}</div></motion.article>; }
