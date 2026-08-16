import { motion, useReducedMotion } from "framer-motion";
import { FaArrowDown, FaExternalLinkAlt, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { availability, EMAIL, GITHUB_URL, LINKEDIN_URL } from "../content";
import { scrollToSection } from "../utils";
import { IconLink } from "./shared";

export function Hero() {
  const reducedMotion = useReducedMotion();
  return <section id="home" className="relative isolate overflow-hidden pb-20 pt-24 sm:pb-28 sm:pt-32"><div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
    <motion.div className="container relative" initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
      <p className="eyebrow">Delhi, India · Available for opportunities</p><h1 className="hero-title">I build products that <span>earn their place</span> in people’s lives.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Full-Stack Developer <span aria-hidden="true">|</span> React.js <span aria-hidden="true">•</span> FastAPI <span aria-hidden="true">•</span> Spring Boot</p>
      <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">I turn useful ideas into polished, dependable web experiences—from the first interface to the final API.</p>
      <p className="availability-line mt-5 max-w-2xl"><span aria-hidden="true" />{availability}</p>
      <div className="mt-8 flex flex-wrap gap-3"><button className="button" onClick={() => scrollToSection("projects")}>View my work <FaArrowDown /></button><button className="button button-secondary" onClick={() => scrollToSection("contact")}>Get in touch <FaExternalLinkAlt /></button></div>
      <div className="mt-10 flex gap-2"><IconLink href={GITHUB_URL} label="Hriday on GitHub"><FaGithub /></IconLink><IconLink href={LINKEDIN_URL} label="Hriday on LinkedIn"><FaLinkedin /></IconLink><IconLink href={`mailto:${EMAIL}`} label="Email Hriday"><FaEnvelope /></IconLink></div>
    </motion.div>
  </section>;
}
