import { motion, useReducedMotion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { serviceIcons, useSiteContent } from "../content";
import { scrollToSection } from "../utils";
import { SectionHeading } from "./shared";

export function Services() {
  const reducedMotion = useReducedMotion();
  const { services } = useSiteContent();
  return <section id="services" className="section"><div className="container"><SectionHeading eyebrow="03 / Services" title="Built for teams that need momentum.">Whether you need a sharp first impression or a complete product foundation, I can help turn the next step into a working experience.</SectionHeading><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{services.map(({ title, description, icon }, index) => { const Icon = serviceIcons[icon as keyof typeof serviceIcons] ?? serviceIcons.code; return <motion.article className="service-card glass-card" key={title} initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: index * 0.05, duration: 0.3 }}><Icon aria-hidden="true" /><h3>{title}</h3><p>{description}</p><button className="text-link" onClick={() => scrollToSection("contact")}>Get a quote <FaArrowDown aria-hidden="true" /></button></motion.article>; })}</div></div></section>;
}
