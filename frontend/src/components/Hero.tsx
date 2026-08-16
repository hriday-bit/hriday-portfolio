import { motion, useReducedMotion } from "framer-motion";
import { FaArrowDown, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { availability, EMAIL, GITHUB_URL, LINKEDIN_URL } from "../content";
import { scrollToSection } from "../utils";

export function Hero() {
  const reducedMotion = useReducedMotion();

  return <section id="home" className="relative isolate overflow-hidden pb-20 pt-24 sm:pb-28 sm:pt-32"><div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" /><motion.div className="container relative" initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}><p className="eyebrow">Full-Stack Developer · React.js · FastAPI · Spring Boot</p><h1 className="hero-title">I build products that <span>earn their place</span> in people’s lives.</h1><p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]">I build responsive interfaces, backend APIs, database-backed workflows, integrations, and deployable web products from idea to production.</p><p className="availability-line mt-5 max-w-2xl"><span aria-hidden="true" />{availability}</p><div className="mt-8 flex flex-wrap gap-3"><button className="button" onClick={() => scrollToSection("projects")}>View Projects <FaArrowDown /></button><a className="button button-secondary" href="/Hriday-Saluja-Resume.pdf" download>Download Résumé <FaArrowDown /></a><button className="button button-secondary" onClick={() => scrollToSection("contact")}>Contact Me <FaEnvelope /></button></div><div className="mt-10 flex gap-2"><a className="icon-button" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="Hriday on GitHub"><FaGithub /></a><a className="icon-button" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="Hriday on LinkedIn"><FaLinkedin /></a><a className="icon-button" href={`mailto:${EMAIL}`} aria-label="Email Hriday"><FaEnvelope /></a></div></motion.div></section>;
}
