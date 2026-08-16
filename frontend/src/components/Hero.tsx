import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowDown, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { availability, EMAIL, GITHUB_URL, LINKEDIN_URL } from "../content";
import { scrollToSection } from "../utils";

const reveal = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export function Hero() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const finePointer = useRef(false);

  useEffect(() => { finePointer.current = !reducedMotion && typeof window.matchMedia === "function" && window.matchMedia("(hover: hover) and (pointer: fine)").matches; }, [reducedMotion]);
  const moveMesh = (event: React.PointerEvent<HTMLElement>) => { if (!finePointer.current || !heroRef.current) return; const bounds = heroRef.current.getBoundingClientRect(); heroRef.current.style.setProperty("--mesh-translate-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 42}px`); heroRef.current.style.setProperty("--mesh-translate-y", `${((event.clientY - bounds.top) / bounds.height - .5) * 42}px`); };
  const magnet = (event: React.PointerEvent<HTMLButtonElement>) => { if (!finePointer.current) return; const bounds = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.transform = `translate3d(${(event.clientX - bounds.left - bounds.width / 2) * .13}px, ${(event.clientY - bounds.top - bounds.height / 2) * .13}px, 0)`; };
  const resetMagnet = (event: React.PointerEvent<HTMLButtonElement>) => { event.currentTarget.style.transform = "translate3d(0, 0, 0)"; };

  return <section id="home" ref={heroRef} onPointerMove={moveMesh} className="hero relative isolate overflow-hidden pb-20 pt-24 sm:pb-28 sm:pt-32"><div className="hero-mesh" aria-hidden="true" /><div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" /><motion.div className="container relative" initial={reducedMotion ? false : "hidden"} animate="visible" variants={{ visible: { transition: { staggerChildren: .08 } } }}><motion.p className="eyebrow" variants={reveal} transition={{ duration: .35 }}>Full-Stack Developer · React.js · FastAPI · Spring Boot</motion.p><motion.h1 className="hero-title" variants={reveal} transition={{ duration: .52, ease: "easeOut" }}>I build products that <span>earn their place</span> in people’s lives.</motion.h1><motion.p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]" variants={reveal} transition={{ duration: .4 }}>I build responsive interfaces, backend APIs, database-backed workflows, integrations, and deployable web products from idea to production.</motion.p><motion.p className="availability-line mt-5 max-w-2xl" variants={reveal} transition={{ duration: .4 }}><span aria-hidden="true" />{availability}</motion.p><motion.div className="mt-8 flex flex-wrap gap-3" variants={reveal} transition={{ duration: .4 }}><button className="button magnetic-button" onPointerMove={magnet} onPointerLeave={resetMagnet} onClick={() => scrollToSection("projects")}>View Projects <FaArrowDown /></button><a className="button button-secondary" href="/Hriday-Saluja-Resume.pdf" download>Download Résumé <FaArrowDown /></a><button className="button button-secondary magnetic-button" onPointerMove={magnet} onPointerLeave={resetMagnet} onClick={() => scrollToSection("contact")}>Contact Me <FaEnvelope /></button></motion.div><motion.div className="mt-10 flex gap-2" variants={reveal} transition={{ duration: .4 }}><a className="icon-button" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="Hriday on GitHub"><FaGithub /></a><a className="icon-button" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="Hriday on LinkedIn"><FaLinkedin /></a><a className="icon-button" href={`mailto:${EMAIL}`} aria-label="Email Hriday"><FaEnvelope /></a></motion.div></motion.div></section>;
}
