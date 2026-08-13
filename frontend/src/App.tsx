import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Navigate, Route, Routes } from "react-router-dom";
import { FaArrowDown, FaBars, FaCode, FaDatabase, FaDocker, FaEnvelope, FaExternalLinkAlt as FaArrowUpRightFromSquare, FaGithub, FaJava, FaLinkedin, FaMoon, FaPython, FaReact, FaServer, FaSun, FaTimes } from "react-icons/fa";
import { SiFastapi, SiFirebase, SiGit, SiJavascript, SiMongodb, SiMysql, SiNextdotjs, SiPostgresql, SiSpringboot, SiTailwindcss, SiTypescript, SiVercel } from "react-icons/si";
import { fallbackProjects } from "./data";
import type { ContactPayload, Project } from "./types";

const GITHUB = "https://github.com/hriday-bit";
const EMAIL = "hridaysaluja2@gmail.com";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const links = ["about", "skills", "projects", "contact"];

type Theme = "dark" | "light";
type Toast = { kind: "success" | "error"; message: string } | null;

function useProjects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/api/projects`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Project API unavailable")))
      .then((data: Project[]) => Array.isArray(data) && setProjects(data))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  return projects;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <div className="mb-10 max-w-2xl"><p className="eyebrow">{eyebrow}</p><h2 className="section-title">{title}</h2>{children && <p className="section-copy">{children}</p>}</div>;
}

function Nav({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  const [open, setOpen] = useState(false);
  const navigate = (id: string) => { setOpen(false); scrollTo(id); };
  return <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:var(--nav)]/85 backdrop-blur-xl">
    <nav className="container flex h-16 items-center justify-between" aria-label="Main navigation">
      <button className="font-display text-2xl font-bold tracking-tight" aria-label="Return to top" onClick={() => scrollTo("home")}>Hriday<span className="text-[var(--accent)]">.</span></button>
      <div className="hidden items-center gap-7 md:flex">{links.map((link) => <button className="nav-link" key={link} onClick={() => navigate(link)}>{link}</button>)}</div>
      <div className="hidden items-center gap-2 md:flex"><IconLink href={GITHUB} label="GitHub profile"><FaGithub /></IconLink><ThemeButton theme={theme} setTheme={setTheme} /><a className="button button-small" href="/Hriday-Saluja-Resume.pdf" download>Resume <FaArrowDown /></a></div>
      <div className="flex items-center gap-2 md:hidden"><ThemeButton theme={theme} setTheme={setTheme} /><button className="icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"}>{open ? <FaTimes /> : <FaBars />}</button></div>
    </nav>
    <AnimatePresence>{open && <motion.div id="mobile-navigation" className="container border-t border-[var(--line)] py-4 md:hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><div className="flex flex-col gap-1">{links.map((link) => <button className="mobile-link" key={link} onClick={() => navigate(link)}>{link}</button>)}<div className="mt-3 flex gap-2"><IconLink href={GITHUB} label="GitHub profile"><FaGithub /></IconLink><a className="button button-small flex-1" href="/Hriday-Saluja-Resume.pdf" download>Download résumé <FaArrowDown /></a></div></div></motion.div>}</AnimatePresence>
  </header>;
}

function ThemeButton({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  const next = theme === "dark" ? "light" : "dark";
  return <button className="icon-button" onClick={() => setTheme(next)} aria-label={`Switch to ${next} mode`}>{theme === "dark" ? <FaSun /> : <FaMoon />}</button>;
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return <a className="icon-button" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label={label}>{children}</a>;
}

function Hero() {
  const reducedMotion = useReducedMotion();
  return <section id="home" className="relative isolate overflow-hidden pb-20 pt-24 sm:pb-28 sm:pt-32"><div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
    <motion.div className="container relative" initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
      <p className="eyebrow">Delhi, India · Available for opportunities</p><h1 className="hero-title">I build products that <span>earn their place</span> in people’s lives.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Full-Stack Developer <span aria-hidden="true">|</span> React.js <span aria-hidden="true">•</span> FastAPI <span aria-hidden="true">•</span> Spring Boot</p>
      <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">I turn useful ideas into polished, dependable web experiences—from the first interface to the final API.</p>
      <div className="mt-8 flex flex-wrap gap-3"><button className="button" onClick={() => scrollTo("projects")}>View my work <FaArrowDown /></button><button className="button button-secondary" onClick={() => scrollTo("contact")}>Get in touch <FaArrowUpRightFromSquare /></button></div>
      <div className="mt-10 flex gap-2"><IconLink href={GITHUB} label="Hriday on GitHub"><FaGithub /></IconLink><IconLink href={`mailto:${EMAIL}`} label="Email Hriday"><FaEnvelope /></IconLink><IconLink href="https://www.linkedin.com" label="LinkedIn profile"><FaLinkedin /></IconLink></div>
    </motion.div>
  </section>;
}

function About() { return <section id="about" className="section"><div className="container grid gap-10 lg:grid-cols-[1fr,0.8fr]"><div><SectionHeading eyebrow="01 / About" title="Curious by default. Practical by design.">I’m Hriday, a BCA student at Jagannath University and a Delhi-based freelance full-stack developer. I build real-world applications end to end, and I’m currently exploring AI-powered features that make products more helpful.</SectionHeading></div><div className="grid grid-cols-2 gap-3 self-start"><Stat value="04+" label="projects shipped" /><Stat value="12" label="core technologies" /><Stat value="∞" label="curiosity level" /><Stat value="01" label="goal: build better" /></div></div></section>; }
function Stat({ value, label }: { value: string; label: string }) { return <div className="glass-card p-5"><strong className="font-display text-3xl text-[var(--text)]">{value}</strong><p className="mt-2 text-sm text-[var(--muted)]">{label}</p></div>; }

const skillGroups = [
  { title: "Frontend", icon: <FaReact />, skills: [["React.js", <FaReact />], ["Next.js", <SiNextdotjs />], ["JavaScript", <SiJavascript />], ["TypeScript", <SiTypescript />], ["Tailwind CSS", <SiTailwindcss />]] },
  { title: "Backend", icon: <FaServer />, skills: [["FastAPI", <SiFastapi />], ["Python", <FaPython />], ["Spring Boot", <SiSpringboot />], ["Java", <FaJava />], ["REST APIs", <FaCode />]] },
  { title: "Database", icon: <FaDatabase />, skills: [["PostgreSQL", <SiPostgresql />], ["MySQL", <SiMysql />], ["MongoDB", <SiMongodb />]] },
  { title: "Tools", icon: <FaCode />, skills: [["Git", <SiGit />], ["GitHub", <FaGithub />], ["Docker", <FaDocker />], ["Firebase", <SiFirebase />], ["Vercel", <SiVercel />]] },
] as const;

function Skills() { const reducedMotion = useReducedMotion(); return <section id="skills" className="section section-muted"><div className="container"><SectionHeading eyebrow="02 / Toolkit" title="A balanced stack for shipping complete products.">From clear interfaces to secure APIs, I choose tools that help the product move forward.</SectionHeading><div className="grid gap-4 sm:grid-cols-2">{skillGroups.map((group, index) => <motion.article className="glass-card p-6" key={group.title} initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.06, duration: 0.35 }}><div className="flex items-center gap-3 text-[var(--accent)]"><span className="text-xl">{group.icon}</span><h3 className="font-semibold text-[var(--text)]">{group.title}</h3></div><ul className="mt-5 flex flex-wrap gap-2">{group.skills.map(([name, icon]) => <li className="skill-pill" key={name}><span>{icon}</span>{name}</li>)}</ul></motion.article>)}</div></div></section>; }

function Projects() { const projects = useProjects(); return <section id="projects" className="section"><div className="container"><SectionHeading eyebrow="03 / Selected work" title="Useful things, built with care.">A few projects that show how I think about product, engineering, and the details in between.</SectionHeading><div className="grid gap-4 md:grid-cols-2">{projects.filter((project) => project.featured).map((project, index) => <ProjectCard project={project} index={index} key={project.id} />)}</div></div></section>; }
function ProjectCard({ project, index }: { project: Project; index: number }) { const reducedMotion = useReducedMotion(); return <motion.article className="project-card glass-card" initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: index * 0.07, duration: 0.35 }}><span className="project-number">0{index + 1}</span><h3 className="mt-12 font-display text-3xl font-bold text-[var(--text)]">{project.title}</h3><p className="mt-4 leading-7 text-[var(--muted)]">{project.description}</p><div className="mt-6 flex flex-wrap gap-2">{project.tech.map((tech) => <span className="tech-badge" key={tech}>{tech}</span>)}</div><div className="mt-8 flex gap-3"><a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">GitHub <FaGithub /></a>{project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <FaArrowUpRightFromSquare /></a>}</div></motion.article>; }

function OpenTo() { const options = ["Full-stack product roles", "Backend engineering roles", "Freelance web development", "Startup collaborations", "Focused MVP builds"]; return <section className="section section-muted"><div className="container"><SectionHeading eyebrow="04 / Open to" title="Let’s make the next useful thing.">I’m open to teams and projects where thoughtful engineering has a real impact.</SectionHeading><ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{options.map((option) => <li className="opportunity" key={option}><span>↗</span>{option}</li>)}</ul></div></section>; }

function Contact({ onToast }: { onToast: (toast: Toast) => void }) {
  const [form, setForm] = useState<ContactPayload>({ name: "", email: "", message: "" }); const [loading, setLoading] = useState(false); const [errors, setErrors] = useState<Partial<ContactPayload>>({});
  const validate = () => { const next: Partial<ContactPayload> = {}; if (form.name.trim().length < 2) next.name = "Please enter your name."; if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address."; if (form.message.trim().length < 10) next.message = "Tell me a little more (10 characters minimum)."; setErrors(next); return !Object.keys(next).length; };
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!validate()) return; setLoading(true); try { const response = await fetch(`${API_BASE_URL}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.detail || "Could not send your message."); setForm({ name: "", email: "", message: "" }); onToast({ kind: "success", message: body.message || "Thanks! Your message has been sent." }); } catch (error) { onToast({ kind: "error", message: error instanceof Error ? error.message : "Could not send your message." }); } finally { setLoading(false); } }
  return <section id="contact" className="section"><div className="container grid gap-10 lg:grid-cols-[0.8fr,1fr]"><div><SectionHeading eyebrow="05 / Contact" title="Have an idea worth building?">Send a note, or reach me directly. I’m always interested in thoughtful products and ambitious teams.</SectionHeading><div className="space-y-3"><a className="contact-link" href={`mailto:${EMAIL}`}><FaEnvelope />{EMAIL}</a><a className="contact-link" href={GITHUB} target="_blank" rel="noreferrer"><FaGithub />github.com/hriday-bit</a></div></div><form className="glass-card p-6 sm:p-8" noValidate onSubmit={submit}><Field label="Name" value={form.name} error={errors.name} onChange={(value) => setForm({ ...form, name: value })} /><Field label="Email" type="email" value={form.email} error={errors.email} onChange={(value) => setForm({ ...form, email: value })} /><Field label="Message" textarea value={form.message} error={errors.message} onChange={(value) => setForm({ ...form, message: value })} /><button className="button mt-2 w-full" type="submit" disabled={loading}>{loading ? "Sending message…" : "Send message"} <FaArrowUpRightFromSquare /></button></form></div></section>;
}
function Field({ label, value, onChange, error, type = "text", textarea = false }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string; textarea?: boolean }) { const id = label.toLowerCase(); const common = { id, value, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value), "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined, className: "input" }; return <label className="mb-5 block text-sm font-medium text-[var(--text)]">{label}{textarea ? <textarea {...common} rows={5} /> : <input {...common} type={type} autoComplete={type === "email" ? "email" : "name"} />}{error && <span id={`${id}-error`} className="field-error">{error}</span>}</label>; }

function Footer() { return <footer className="border-t border-[var(--line)] py-8"><div className="container flex flex-col gap-4 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Hriday Saluja. All rights reserved.</p><p className="font-mono text-xs tracking-widest">BUILD • LEARN • SHIP • IMPROVE</p><div className="flex gap-2"><IconLink href={GITHUB} label="GitHub"><FaGithub /></IconLink><IconLink href={`mailto:${EMAIL}`} label="Email"><FaEnvelope /></IconLink></div></div></footer>; }

function Portfolio() { const [theme, setTheme] = useState<Theme>(() => localStorage.getItem("theme") === "light" ? "light" : "dark"); const [toast, setToast] = useState<Toast>(null); useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("theme", theme); }, [theme]); useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), 5000); return () => window.clearTimeout(timer); }, [toast]); return <><Nav theme={theme} setTheme={setTheme} /><main><Hero /><About /><Skills /><Projects /><OpenTo /><Contact onToast={setToast} /></main><Footer /><AnimatePresence>{toast && <motion.div className={`toast toast-${toast.kind}`} role="status" aria-live="polite" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>{toast.message}<button onClick={() => setToast(null)} aria-label="Dismiss notification"><FaTimes /></button></motion.div>}</AnimatePresence></>; }

export default function App() { return <Routes><Route path="/" element={<Portfolio />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>; }
