import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { serviceIcons, useSiteContent } from "../content";
import { scrollToSection } from "../utils";
import { SectionHeading } from "./shared";

export function Services() {
  const reducedMotion = useReducedMotion();
  const { services } = useSiteContent();
  const finePointer = useRef(false);
  useEffect(() => { finePointer.current = !reducedMotion && typeof window.matchMedia === "function" && window.matchMedia("(hover: hover) and (pointer: fine)").matches; }, [reducedMotion]);
  const track = (event: React.PointerEvent<HTMLElement>) => { if (!finePointer.current) return; const card = event.currentTarget; const bounds = card.getBoundingClientRect(); const x = (event.clientX - bounds.left) / bounds.width - .5; const y = (event.clientY - bounds.top) / bounds.height - .5; card.style.setProperty("--spotlight-x", `${(x + .5) * 100}%`); card.style.setProperty("--spotlight-y", `${(y + .5) * 100}%`); card.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translate3d(0, -3px, 0)`; };
  const reset = (event: React.PointerEvent<HTMLElement>) => { event.currentTarget.style.transform = ""; };
  return <section id="services" className="section"><div className="container"><SectionHeading eyebrow="06 / Services" title="Focused services for useful web products.">Business websites, full-stack applications, API integrations, and production delivery — scoped around the work your product needs.</SectionHeading><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{services.map(({ title, description, icon }, index) => { const Icon = serviceIcons[icon as keyof typeof serviceIcons] ?? serviceIcons.code; return <motion.article className="service-card service-card-interactive glass-card" key={title} onPointerMove={track} onPointerLeave={reset} initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: index * 0.05, duration: 0.3 }}><Icon aria-hidden="true" /><h3>{title}</h3><p>{description}</p><button className="text-link" onClick={() => scrollToSection("contact")}>Get a quote <FaArrowDown aria-hidden="true" /></button></motion.article>; })}</div></div></section>;
}
