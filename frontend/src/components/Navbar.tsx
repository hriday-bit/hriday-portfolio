import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowDown, FaBars, FaGithub, FaLinkedin, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { GITHUB_URL, LINKEDIN_URL } from "../content";
import { scrollToSection } from "../utils";
import { IconLink } from "./shared";

const links = ["home", "about", "work", "projects", "skills", "services", "contact"];
type Theme = "dark" | "light";

export function Navbar({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = (id: string) => { setOpen(false); scrollToSection(id); };
  const nextTheme = theme === "dark" ? "light" : "dark";
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = links.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-20% 0px -58% 0px", threshold: [0.1, 0.35, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:var(--nav)]/85 backdrop-blur-xl">
    <nav className="container flex h-16 items-center justify-between" aria-label="Main navigation">
      <button className="font-display text-2xl font-bold tracking-tight" aria-label="Return to top" onClick={() => scrollToSection("home")}>Hriday<span className="text-[var(--accent)]">.</span></button>
      <div className="hidden items-center gap-7 md:flex">{links.map((link) => <button className={`nav-link${activeSection === link ? " is-active" : ""}`} aria-current={activeSection === link ? "page" : undefined} key={link} onClick={() => navigate(link)}>{link}</button>)}</div>
      <div className="hidden items-center gap-2 md:flex"><IconLink href={GITHUB_URL} label="GitHub profile"><FaGithub /></IconLink><IconLink href={LINKEDIN_URL} label="LinkedIn profile"><FaLinkedin /></IconLink><ThemeButton theme={theme} nextTheme={nextTheme} onToggle={() => setTheme(nextTheme)} /><a className="button button-small" href="/Hriday-Saluja-Resume.pdf" download>Resume <FaArrowDown /></a></div>
      <div className="flex items-center gap-2 md:hidden"><ThemeButton theme={theme} nextTheme={nextTheme} onToggle={() => setTheme(nextTheme)} /><button className="icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"}>{open ? <FaTimes /> : <FaBars />}</button></div>
    </nav>
    <AnimatePresence>{open && <motion.div id="mobile-navigation" className="container border-t border-[var(--line)] py-4 md:hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><div className="flex flex-col gap-1">{links.map((link) => <button className={`mobile-link${activeSection === link ? " is-active" : ""}`} aria-current={activeSection === link ? "page" : undefined} key={link} onClick={() => navigate(link)}>{link}</button>)}<div className="mt-3 flex gap-2"><IconLink href={GITHUB_URL} label="GitHub profile"><FaGithub /></IconLink><IconLink href={LINKEDIN_URL} label="LinkedIn profile"><FaLinkedin /></IconLink><a className="button button-small flex-1" href="/Hriday-Saluja-Resume.pdf" download>Download resume <FaArrowDown /></a></div></div></motion.div>}</AnimatePresence>
  </header>;
}

function ThemeButton({ theme, nextTheme, onToggle }: { theme: Theme; nextTheme: Theme; onToggle: () => void }) {
  return <button className="icon-button" onClick={onToggle} aria-label={`Switch to ${nextTheme} mode`}><AnimatePresence mode="wait" initial={false}><motion.span key={theme} initial={{ opacity: 0, rotate: -80, scale: .65 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 80, scale: .65 }} transition={{ duration: .18 }} aria-hidden="true">{theme === "dark" ? <FaSun /> : <FaMoon />}</motion.span></AnimatePresence></button>;
}
