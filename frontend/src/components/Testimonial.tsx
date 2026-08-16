import { motion, useReducedMotion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { useSiteContent } from "../content";

export function Testimonial() {
  const reducedMotion = useReducedMotion(); const { testimonial } = useSiteContent();
  return <section className="section testimonial-section"><motion.figure className="container testimonial-card glass-card" initial={reducedMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }}><FaQuoteLeft aria-hidden="true" /><blockquote>{testimonial.quote}</blockquote><figcaption><strong>{testimonial.name}</strong><span>{testimonial.role} · Placeholder testimonial</span></figcaption></motion.figure></section>;
}
