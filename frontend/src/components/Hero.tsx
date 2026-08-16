import { motion, useReducedMotion } from "framer-motion";
import { FaArrowDown, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { availability, EMAIL, GITHUB_URL, LINKEDIN_URL } from "../content";
import { scrollToSection } from "../utils";
import { IconLink } from "./shared";

export function Hero() {
  const reducedMotion = useReducedMotion();
  return <section id="home" className="relative isolate overflow-hidden pb-20 pt-24 sm:pb-28 sm:pt-32"><div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" /><motion.div className="container relative" initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}><p className="eyebrow">Delhi, India · Full-stack developer</p><h1 className="hero-title">Full-Stack Developer building <span>production-ready web applications with React, FastAPI &amp; Spring Boot.</span></h1><p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]">I build responsive interfaces, backend APIs, database-backed workflows, integrations, and deployable web products from idea to production.</p><p className="availability-line mt-5 max-w-2xl"><span aria-hidden="true" />{availability}</p><div className="mt-8 flex flex-wrap gap-3"><button className="button" onClick={() => scrollToSection("projects")}>View projects <FaArrowDown /></button><a className="button button-secondary" href="/Hriday-Saluja-Resume.pdf" download>Download résumé <FaArrowDown /></a><button className="button button-secondary" onClick={() => scrollToSection("contact")}>Contact me <FaEnvelope /></button></div><div className="mt-10 flex gap-2"><IconLink href={GITHUB_URL} label="Hriday on GitHub"><FaGithub /></IconLink><IconLink href={LINKEDIN_URL} label="Hriday on LinkedIn"><FaLinkedin /></IconLink><IconLink href={`mailto:${EMAIL}`} label="Email Hriday"><FaEnvelope /></IconLink></div></motion.div></section>;
}
