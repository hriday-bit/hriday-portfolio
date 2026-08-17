import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { fallbackProjects } from "../data";
import { contentReveal, motionTokens, supportsFinePointer } from "../motion";
import type { Project } from "../types";
import { SectionHeading } from "./shared";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:8000" : "");
const highlights: Record<string, string[]> = {
  "lovelens-ai": ["React and TypeScript product interface", "AI integration for compatibility-focused product features"],
  "solar-website": ["Responsive React interface with scroll animations", "WhatsApp-based inquiry path and production deployment"],
  "student-attendance-system": ["JWT authentication and multiple REST API modules", "Vue 3 frontend with Spring Boot and MySQL"],
  "uk-payroll-calculator": ["Weekly pay workflows for deductions, overtime, and expenses", "Next.js and NestJS application architecture with Prisma"],
};

function useProjects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/api/projects`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: Project[]) => Array.isArray(data) && setProjects(data))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  return projects;
}

export function projectStory(description: string) {
  const values = description.replace("Problem: ", "").replace("Solution: ", "|").replace("Result: ", "|").split("|").map((item) => item.trim());
  return { problem: values[0] ?? description, solution: values[1] ?? "", outcome: values[2] ?? "" };
}

export function Projects() {
  const projects = useProjects();
  const reducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [eligible, setEligible] = useState(false);
  const [filmstripReady, setFilmstripReady] = useState(false);
  const visibleProjects = projects.filter((project) => project.featured);

  useEffect(() => {
    if (reducedMotion || !viewportRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEligible(true); observer.disconnect(); }
    }, { rootMargin: "280px 0px" });
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (!eligible || reducedMotion || !viewportRef.current || !trackRef.current) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([core, plugin]) => {
      if (!active || !viewportRef.current || !trackRef.current) return;
      const gsap = core.gsap;
      gsap.registerPlugin(plugin.ScrollTrigger);
      const media = gsap.matchMedia();
      context = {
        revert: () => media.revert(),
      };

      media.add("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return;
        setFilmstripReady(true);
        let frame = window.requestAnimationFrame(() => {
          frame = 0;
          const cards = gsap.utils.toArray<HTMLElement>(".project-card", track);
          const overflow = track.scrollWidth - viewport.clientWidth;
          if (cards.length < 2 || overflow <= 0) { setFilmstripReady(false); return; }
          const setActive = (index: number) => cards.forEach((card, cardIndex) => card.classList.toggle("project-card-active", cardIndex === index));
          setActive(0);
          gsap.timeline({
            scrollTrigger: {
              trigger: viewport,
              start: "top 18%",
              end: `+=${Math.max(1400, Math.round(overflow * 1.15))}`,
              pin: true,
              scrub: 0.65,
              anticipatePin: 1,
              onUpdate: (self) => setActive(Math.round(self.progress * (cards.length - 1))),
            },
          }).to(track, { x: -overflow, duration: 1, ease: "none" });
        });
        return () => { if (frame) window.cancelAnimationFrame(frame); setFilmstripReady(false); };
      });
    }).catch(() => setFilmstripReady(false));

    return () => { active = false; context?.revert(); setFilmstripReady(false); };
  }, [eligible, reducedMotion, visibleProjects.length]);

  const focusCard = (event: React.FocusEvent<HTMLDivElement>) => {
    const card = (event.target as HTMLElement).closest<HTMLElement>(".project-card");
    if (card) trackRef.current?.querySelectorAll(".project-card").forEach((item) => item.classList.toggle("project-card-active", item === card));
  };

  return <section id="projects" className="section projects-section">
    <div className="container">
      <SectionHeading eyebrow="02 / Projects" title="Engineering work, explained clearly.">Selected applications with the context, implementation, and proof behind each build.</SectionHeading>
      <div ref={viewportRef} className={`projects-viewport${filmstripReady ? " projects-filmstrip-enabled" : ""}`}>
        <div ref={trackRef} onFocusCapture={focusCard} className={filmstripReady ? "projects-filmstrip" : "projects-grid grid gap-5 md:grid-cols-2"}>
          {visibleProjects.map((project, index) => <ProjectCard project={project} index={index} key={project.id} />)}
        </div>
      </div>
    </div>
  </section>;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reducedMotion = useReducedMotion();
  const finePointer = useRef(false);
  const caseStudy = projectStory(project.description);
  const isSolar = project.id === "solar-website";

  useEffect(() => { finePointer.current = !reducedMotion && supportsFinePointer(); }, [reducedMotion]);

  const trackDepth = (event: React.PointerEvent<HTMLElement>) => {
    if (!finePointer.current) return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty("--card-tilt-x", `${-y * 2}deg`);
    card.style.setProperty("--card-tilt-y", `${x * 2}deg`);
    card.style.setProperty("--card-light-x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--card-light-y", `${(y + 0.5) * 100}%`);
  };

  const resetDepth = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.removeProperty("--card-tilt-x");
    event.currentTarget.style.removeProperty("--card-tilt-y");
  };

  return <motion.article className={`project-card glass-card ${isSolar ? "project-card-featured" : ""}`} onPointerMove={trackDepth} onPointerLeave={resetDepth} initial={reducedMotion ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={contentReveal} transition={{ delay: index * motionTokens.stagger }}>
    <span className="project-number">0{index + 1}</span>
    {isSolar && <div className="work-labels"><span>Client Work</span><span>Production</span></div>}
    <h3>{project.title}</h3>
    <div className="project-case">
      <section><h4>Problem</h4><p>{caseStudy.problem}</p></section>
      <section><h4>Solution</h4><p>{caseStudy.solution}</p></section>
      <section><h4>Implementation / outcome</h4><p>{caseStudy.outcome}</p></section>
    </div>
    <section className="project-highlights"><h4>Engineering highlights</h4><ul>{(highlights[project.id] ?? ["Implemented a focused application workflow using the listed technology stack."]).map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></section>
    <div className="mt-6 flex flex-wrap gap-2">{project.tech.map((tech) => <span className="tech-badge" key={tech}>{tech}</span>)}</div>
    <div className="mt-8 flex flex-wrap gap-4">
      <a className="text-link proof-link" href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub <FaGithub /></a>
      {project.liveUrl && <a className="text-link proof-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live demo <FaExternalLinkAlt /></a>}
    </div>
  </motion.article>;
}
