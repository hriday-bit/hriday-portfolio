import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { fallbackProjects } from "../data";
import type { Project } from "../types";
import { SectionHeading } from "./shared";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function useProjects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  useEffect(() => { const controller = new AbortController(); fetch(`${API_BASE_URL}/api/projects`, { signal: controller.signal }).then((response) => response.ok ? response.json() : Promise.reject(new Error("Project API unavailable"))).then((data: Project[]) => Array.isArray(data) && setProjects(data)).catch(() => undefined); return () => controller.abort(); }, []);
  return projects;
}

export function Projects() { const projects = useProjects(); return <section id="projects" className="section"><div className="container"><SectionHeading eyebrow="04 / Selected work" title="Useful things, built with care.">A few projects that show how I think about product, engineering, and the details in between.</SectionHeading><div className="grid gap-4 md:grid-cols-2">{projects.filter((project) => project.featured).map((project, index) => <ProjectCard project={project} index={index} key={project.id} />)}</div></div></section>; }

function ProjectCard({ project, index }: { project: Project; index: number }) { const reducedMotion = useReducedMotion(); return <motion.article className="project-card glass-card" initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: index * 0.07, duration: 0.35 }}><span className="project-number">0{index + 1}</span><h3 className="mt-12 font-display text-3xl font-bold text-[var(--text)]">{project.title}</h3><p className="project-story mt-4">{project.description}</p><div className="mt-6 flex flex-wrap gap-2">{project.tech.map((tech) => <span className="tech-badge" key={tech}>{tech}</span>)}</div><div className="mt-8 flex gap-3"><a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">GitHub <FaGithub /></a>{project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <FaExternalLinkAlt /></a>}</div></motion.article>; }
