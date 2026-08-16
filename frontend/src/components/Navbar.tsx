import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowDown, FaBars, FaGithub, FaLinkedin, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { GITHUB_URL, LINKEDIN_URL } from "../content";
import { scrollToSection } from "../utils";
import { IconLink } from "./shared";

const links = ["about", "skills", "services", "projects", "contact"];
type Theme = "dark" | "light";

export function Navbar({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  const [open, setOpen] = useState(false);
  const navigate = (id: string) => { setOpen(false); scrollToSection(id); };
  const nextTheme = theme === "dark" ? "light" : "dark";
  return <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:var(--nav)]/85 backdrop-blur-xl">
    <nav className="container flex h-16 items-center justify-between" aria-label="Main navigation">
      <button className="font-display text-2xl font-bold tracking-tight" aria-label="Return to top" onClick={() => scrollToSection("home")}>Hriday<span className="text-[var(--accent)]">.</span></button>
      <div className="hidden items-center gap-7 md:flex">{links.map((link) => <button className="nav-link" key={link} onClick={() => navigate(link)}>{link}</button>)}</div>
      <div className="hidden items-center gap-2 md:flex"><IconLink href={GITHUB_URL} label="GitHub profile"><FaGithub /></IconLink><IconLink href={LINKEDIN_URL} label="LinkedIn profile"><FaLinkedin /></IconLink><button className="icon-button" onClick={() => setTheme(nextTheme)} aria-label={`Switch to ${nextTheme} mode`}>{theme === "dark" ? <FaSun /> : <FaMoon />}</button><a className="button button-small" href="/Hriday-Saluja-Resume.pdf" download>Resume <FaArrowDown /></a></div>
      <div className="flex items-center gap-2 md:hidden"><button className="icon-button" onClick={() => setTheme(nextTheme)} aria-label={`Switch to ${nextTheme} mode`}>{theme === "dark" ? <FaSun /> : <FaMoon />}</button><button className="icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"}>{open ? <FaTimes /> : <FaBars />}</button></div>
    </nav>
    <AnimatePresence>{open && <motion.div id="mobile-navigation" className="container border-t border-[var(--line)] py-4 md:hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><div className="flex flex-col gap-1">{links.map((link) => <button className="mobile-link" key={link} onClick={() => navigate(link)}>{link}</button>)}<div className="mt-3 flex gap-2"><IconLink href={GITHUB_URL} label="GitHub profile"><FaGithub /></IconLink><IconLink href={LINKEDIN_URL} label="LinkedIn profile"><FaLinkedin /></IconLink><a className="button button-small flex-1" href="/Hriday-Saluja-Resume.pdf" download>Download resume <FaArrowDown /></a></div></div></motion.div>}</AnimatePresence>
  </header>;
}
