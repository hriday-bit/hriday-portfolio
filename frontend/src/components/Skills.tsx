import { motion, useReducedMotion } from "framer-motion";
import { FaCode, FaDatabase, FaDocker, FaGithub, FaJava, FaPython, FaReact, FaServer } from "react-icons/fa";
import { SiFastapi, SiFirebase, SiGit, SiJavascript, SiMongodb, SiMysql, SiNextdotjs, SiPostgresql, SiSpringboot, SiTailwindcss, SiTypescript, SiVercel } from "react-icons/si";
import { SectionHeading } from "./shared";

const skillGroups = [
  { title: "Frontend", icon: <FaReact />, skills: [["React.js", <FaReact />], ["Next.js", <SiNextdotjs />], ["JavaScript", <SiJavascript />], ["TypeScript", <SiTypescript />], ["Tailwind CSS", <SiTailwindcss />]] },
  { title: "Backend", icon: <FaServer />, skills: [["FastAPI", <SiFastapi />], ["Python", <FaPython />], ["Spring Boot", <SiSpringboot />], ["Java", <FaJava />], ["REST APIs", <FaCode />]] },
  { title: "Database", icon: <FaDatabase />, skills: [["PostgreSQL", <SiPostgresql />], ["MySQL", <SiMysql />], ["MongoDB", <SiMongodb />]] },
  { title: "Tools", icon: <FaCode />, skills: [["Git", <SiGit />], ["GitHub", <FaGithub />], ["Docker", <FaDocker />], ["Firebase", <SiFirebase />], ["Vercel", <SiVercel />]] },
] as const;

export function Skills() { const reducedMotion = useReducedMotion(); return <section id="skills" className="section section-muted"><div className="container"><SectionHeading eyebrow="02 / Toolkit" title="A balanced stack for shipping complete products.">From clear interfaces to secure APIs, I choose tools that help the product move forward.</SectionHeading><div className="grid gap-4 sm:grid-cols-2">{skillGroups.map((group, index) => <motion.article className="glass-card p-6" key={group.title} initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.06, duration: 0.35 }}><div className="flex items-center gap-3 text-[var(--accent)]"><span className="text-xl">{group.icon}</span><h3 className="font-semibold text-[var(--text)]">{group.title}</h3></div><ul className="mt-5 flex flex-wrap gap-2">{group.skills.map(([name, icon]) => <li className="skill-pill" key={name}><span>{icon}</span>{name}</li>)}</ul></motion.article>)}</div></div></section>; }
