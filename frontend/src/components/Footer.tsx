import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "../content";
import { IconLink } from "./shared";

export function Footer() { return <footer className="border-t border-[var(--line)] py-8"><div className="container flex flex-col gap-4 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Hriday Saluja. All rights reserved.</p><p className="font-mono text-xs tracking-widest">BUILD • LEARN • SHIP • IMPROVE</p><div className="flex gap-2"><IconLink href={GITHUB_URL} label="GitHub"><FaGithub /></IconLink><IconLink href={LINKEDIN_URL} label="LinkedIn"><FaLinkedin /></IconLink><IconLink href={`mailto:${EMAIL}`} label="Email"><FaEnvelope /></IconLink></div></div></footer>; }
