import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { motionTokens } from "../motion";
import { SectionHeading } from "./shared";

type ArchitectureKey = "interface" | "api" | "database" | "whatsapp";

const engineeringHighlights: { key: ArchitectureKey; label: string; detail: string }[] = [
  { key: "interface", label: "Responsive interface", detail: "Built the React frontend experience with scroll animations and a focused contact flow." },
  { key: "api", label: "Backend service", detail: "Delivered the project with FastAPI as part of the production web stack." },
  { key: "database", label: "Data layer", detail: "Delivered the project with PostgreSQL as part of the production web stack." },
  { key: "whatsapp", label: "Inquiry integration", detail: "Added the WhatsApp-based path for potential customers to start an inquiry." },
];

export function Work() {
  const reducedMotion = useReducedMotion();
  const [activeKey, setActiveKey] = useState<ArchitectureKey | null>(null);
  const activate = (key: ArchitectureKey) => setActiveKey(key);

  return <section id="work" className="section selected-work-section">
    <div className="container">
      <SectionHeading eyebrow="01 / Selected work" title="Real work for a live business.">A focused look at verified freelance production work.</SectionHeading>
      <article className="selected-work glass-card">
        <div className="selected-work-copy">
          <div className="work-labels"><span>Client Work</span><span>Production</span></div>
          <p className="eyebrow">Rishabh Enterprises / Solar Website</p>
          <h3>Building a credible online inquiry path for a solar business.</h3>
          <p>A responsive business website for a solar panel and battery company that needed an online presence and a straightforward way for potential customers to get in touch.</p>
          <dl>
            <div><dt>Contribution</dt><dd>Built the responsive frontend experience, contact flow, scroll animations, and WhatsApp-based inquiry path.</dd></div>
            <div><dt>Delivery</dt><dd>Shipped a production website with React, FastAPI, and PostgreSQL.</dd></div>
          </dl>
          <section className="engineering-connections" aria-labelledby="engineering-connections-title">
            <p className="eyebrow" id="engineering-connections-title">Engineering connections</p>
            <ul>
              {engineeringHighlights.map((highlight) => <li key={highlight.key}>
                <button type="button" className={activeKey === highlight.key ? "architecture-highlight is-active" : "architecture-highlight"} onPointerEnter={() => activate(highlight.key)} onFocus={() => activate(highlight.key)} onPointerLeave={() => setActiveKey(null)} onBlur={() => setActiveKey(null)}>
                  <strong>{highlight.label}</strong><span>{highlight.detail}</span>
                </button>
              </li>)}
            </ul>
          </section>
        </div>
        <aside className="selected-work-proof">
          <SolarArchitecture activeKey={activeKey} reducedMotion={Boolean(reducedMotion)} />
          <div className="mt-8 flex flex-wrap gap-4">
            <a className="text-link proof-link" href="https://solar-website-api-server.vercel.app/" target="_blank" rel="noopener noreferrer">Live website <FaExternalLinkAlt /></a>
            <a className="text-link proof-link" href="https://github.com/hriday-bit/solar-website" target="_blank" rel="noopener noreferrer">GitHub <FaGithub /></a>
          </div>
        </aside>
      </article>
    </div>
  </section>;
}

function SolarArchitecture({ activeKey, reducedMotion }: { activeKey: ArchitectureKey | null; reducedMotion: boolean }) {
  const activeClass = (key: ArchitectureKey) => activeKey === key ? " is-active" : "";
  const connectorClass = (key: "interface" | "api" | "whatsapp") => `architecture-connector ${key}${activeKey === key || (key === "api" && activeKey === "database") ? " is-active" : ""}`;
  const shouldAnimate = !reducedMotion && typeof IntersectionObserver !== "undefined";
  const visible = shouldAnimate ? { opacity: 0, y: 10 } : false;

  return <section className="architecture-map" aria-labelledby="architecture-title">
    <div className="architecture-heading"><p className="eyebrow">System map</p><h4 id="architecture-title">A production inquiry flow.</h4></div>
    <p id="architecture-description" className="sr-only">A React interface connects to FastAPI and PostgreSQL. A WhatsApp inquiry path starts from the interface. The work is marked as production delivery.</p>
    <div className="architecture-stage" aria-describedby="architecture-description">
      <svg className="architecture-lines" viewBox="0 0 320 300" aria-hidden="true" preserveAspectRatio="none">
        <motion.path className={connectorClass("interface")} d="M160 66 L160 126" initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false} whileInView={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined} viewport={{ once: true, amount: 0.45 }} transition={{ duration: motionTokens.technical, delay: 0.16, ease: motionTokens.ease }} />
        <motion.path className={connectorClass("api")} d="M160 174 L160 234" initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false} whileInView={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined} viewport={{ once: true, amount: 0.45 }} transition={{ duration: motionTokens.technical, delay: 0.3, ease: motionTokens.ease }} />
        <motion.path className={connectorClass("whatsapp")} d="M108 53 C62 53 53 86 53 118" initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false} whileInView={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined} viewport={{ once: true, amount: 0.45 }} transition={{ duration: motionTokens.technical, delay: 0.42, ease: motionTokens.ease }} />
        {shouldAnimate && <motion.circle className="architecture-pulse" r="4" initial={{ opacity: 0, cx: 160, cy: 66 }} whileInView={{ opacity: [0, 1, 1, 0], cx: [160, 160, 160], cy: [66, 126, 174] }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.8, delay: 0.9, ease: "easeInOut" }} />}
      </svg>
      <motion.div className={`architecture-node node-interface${activeClass("interface")}`} initial={visible} whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined} viewport={{ once: true, amount: 0.45 }} transition={{ duration: motionTokens.standard, ease: motionTokens.ease }}><span>01</span><strong>React interface</strong><small>Responsive website</small></motion.div>
      <motion.div className={`architecture-node node-api${activeClass("api")}`} initial={visible} whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined} viewport={{ once: true, amount: 0.45 }} transition={{ duration: motionTokens.standard, delay: 0.12, ease: motionTokens.ease }}><span>02</span><strong>FastAPI</strong><small>Backend service</small></motion.div>
      <motion.div className={`architecture-node node-database${activeClass("database")}`} initial={visible} whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined} viewport={{ once: true, amount: 0.45 }} transition={{ duration: motionTokens.standard, delay: 0.24, ease: motionTokens.ease }}><span>03</span><strong>PostgreSQL</strong><small>Data layer</small></motion.div>
      <motion.div className={`architecture-node node-whatsapp${activeClass("whatsapp")}`} initial={visible} whileInView={shouldAnimate ? { opacity: 1, x: -8 } : undefined} viewport={{ once: true, amount: 0.45 }} transition={{ duration: motionTokens.standard, delay: 0.36, ease: motionTokens.ease }}><span>↗</span><strong>WhatsApp</strong><small>Inquiry path</small></motion.div>
    </div>
    <div className="architecture-badges" aria-label="Solar Website technology stack">
      <span className={`tech-badge${activeClass("interface")}`}>React</span><span className={`tech-badge${activeClass("api")}`}>FastAPI</span><span className={`tech-badge${activeClass("database")}`}>PostgreSQL</span><span className="architecture-status">Production delivery</span>
    </div>
  </section>;
}
