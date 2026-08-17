import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowDown, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { availability, EMAIL, GITHUB_URL, LINKEDIN_URL } from "../content";
import { editorialContainer, editorialLineReveal, editorialReveal, motionTokens, supportsFinePointer } from "../motion";
import { scrollToSection } from "../utils";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const finePointer = useRef(false);
  const meshFrame = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    finePointer.current = !reducedMotion && supportsFinePointer();
    return () => { if (meshFrame.current) window.cancelAnimationFrame(meshFrame.current); };
  }, [reducedMotion]);

  const updateMesh = () => {
    meshFrame.current = 0;
    const hero = heroRef.current;
    if (!hero) return;
    hero.style.setProperty("--mesh-translate-x", `${pointer.current.x * 18}px`);
    hero.style.setProperty("--mesh-translate-y", `${pointer.current.y * 18}px`);
  };

  const moveMesh = (event: React.PointerEvent<HTMLElement>) => {
    if (!finePointer.current || !heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    pointer.current = {
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    };
    if (!meshFrame.current) meshFrame.current = window.requestAnimationFrame(updateMesh);
  };

  const resetMesh = () => {
    if (!finePointer.current || !heroRef.current) return;
    pointer.current = { x: 0, y: 0 };
    if (!meshFrame.current) meshFrame.current = window.requestAnimationFrame(updateMesh);
  };

  const magnet = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!finePointer.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.transform = `translate3d(${(event.clientX - bounds.left - bounds.width / 2) * 0.1}px, ${(event.clientY - bounds.top - bounds.height / 2) * 0.1}px, 0)`;
  };

  const resetMagnet = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.transform = "translate3d(0, 0, 0)";
  };

  return <section id="home" ref={heroRef} onPointerMove={moveMesh} onPointerLeave={resetMesh} className="hero relative isolate overflow-hidden pb-20 pt-24 sm:pb-28 sm:pt-32">
    <div className="hero-mesh" aria-hidden="true" />
    <div className="hero-orb hero-orb-one" aria-hidden="true" />
    <div className="hero-orb hero-orb-two" aria-hidden="true" />
    <motion.div className="container relative" initial={reducedMotion ? false : "hidden"} animate="visible" variants={editorialContainer}>
      <motion.p className="eyebrow" variants={editorialReveal}>Full-Stack Developer {"\u00b7"} React.js {"\u00b7"} FastAPI {"\u00b7"} Spring Boot</motion.p>
      <motion.h1 className="hero-title" variants={editorialReveal}>
        <span className="hero-line-mask"><motion.span variants={editorialLineReveal}>I build products that{" "}</motion.span></span>
        <span className="hero-line-mask"><motion.span variants={editorialLineReveal}><span className="hero-gradient">earn their place</span> in people{"\u2019"}s lives.</motion.span></span>
      </motion.h1>
      <motion.p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]" variants={editorialReveal}>I build responsive interfaces, backend APIs, database-backed workflows, integrations, and deployable web products from idea to production.</motion.p>
      <motion.p className="availability-line mt-5 max-w-2xl" variants={editorialReveal}><span aria-hidden="true" />{availability}</motion.p>
      <motion.div className="mt-8 flex flex-wrap gap-3" variants={editorialReveal} transition={{ delay: motionTokens.stagger }}>
        <button className="button magnetic-button" onPointerMove={magnet} onPointerLeave={resetMagnet} onClick={() => scrollToSection("projects")}>View Projects <FaArrowDown /></button>
        <a className="button button-secondary" href="/Hriday-Saluja-Resume.pdf" download>Download R{"\u00e9"}sum{"\u00e9"} <FaArrowDown /></a>
        <button className="button button-secondary magnetic-button" onPointerMove={magnet} onPointerLeave={resetMagnet} onClick={() => scrollToSection("contact")}>Contact Me <FaEnvelope /></button>
      </motion.div>
      <motion.div className="mt-10 flex gap-2" variants={editorialReveal}>
        <a className="icon-button" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="Hriday on GitHub"><FaGithub /></a>
        <a className="icon-button" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="Hriday on LinkedIn"><FaLinkedin /></a>
        <a className="icon-button" href={`mailto:${EMAIL}`} aria-label="Email Hriday"><FaEnvelope /></a>
      </motion.div>
    </motion.div>
  </section>;
}
