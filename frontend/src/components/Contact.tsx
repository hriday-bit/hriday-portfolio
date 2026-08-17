import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaExternalLinkAlt as FaArrowUpRightFromSquare, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "../content";
import { contentReveal, motionTokens } from "../motion";
import type { ContactPayload } from "../types";
import { SectionHeading } from "./shared";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:8000" : "");
type Toast = { kind: "success" | "error"; message: string } | null;

export function Contact({ onToast }: { onToast: (toast: Toast) => void }) {
  const reducedMotion = useReducedMotion();
  const [form, setForm] = useState<ContactPayload>({ name: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactPayload>>({});
  const validate = () => {
    const next: Partial<ContactPayload> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (form.message.trim().length < 10) next.message = "Tell me a little more (10 characters minimum).";
    setErrors(next);
    return !Object.keys(next).length;
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof body.detail === "string" ? body.detail : "Could not save your message.");
      setForm({ name: "", message: "" });
      onToast({ kind: "success", message: "Message sent successfully!" });
    } catch (error) {
      onToast({ kind: "error", message: error instanceof Error ? error.message : "Could not save your message." });
    } finally {
      setLoading(false);
    }
  }

  return <section id="contact" className="section contact-section">
    <div className="container grid gap-10 lg:grid-cols-[0.8fr,1fr]">
      <motion.div initial={reducedMotion ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={contentReveal}>
        <SectionHeading eyebrow="07 / Contact" title={"Let\u2019s build something useful."}>Choose the path that fits you best, then send a note.</SectionHeading>
        <div className="contact-paths">
          <div className="contact-path"><h3>For recruiters</h3><p>View my r{"\u00e9"}sum{"\u00e9"} and connect on LinkedIn for full-time roles and internships.</p><div className="flex flex-wrap gap-3"><a className="text-link proof-link" href="/Hriday-Saluja-Resume.pdf" download>Download r{"\u00e9"}sum{"\u00e9"}</a><a className="text-link proof-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn <FaLinkedin /></a></div></div>
          <div className="contact-path"><h3>For clients</h3><p>Tell me about your project, timeline, and what you need to build.</p></div>
        </div>
        <div className="mt-6 space-y-3">
          <a className="contact-link" href={`mailto:${EMAIL}`}><FaEnvelope />{EMAIL}</a>
          <a className="contact-link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer"><FaGithub />github.com/hriday-bit</a>
          <a className="contact-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"><FaLinkedin />linkedin.com/in/hriday-saluja-1a2562384</a>
        </div>
      </motion.div>
      <motion.form className="glass-card p-6 sm:p-8" noValidate onSubmit={submit} initial={reducedMotion ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={contentReveal} transition={{ delay: motionTokens.stagger }}>
        <Field label="Name" value={form.name} error={errors.name} onChange={(value) => setForm({ ...form, name: value })} />
        <Field label="Message" textarea value={form.message} error={errors.message} onChange={(value) => setForm({ ...form, message: value })} />
        <button className="button mt-2 w-full" type="submit" disabled={loading}>{loading ? "Saving message..." : "Save message"} <FaArrowUpRightFromSquare /></button>
      </motion.form>
    </div>
  </section>;
}

function Field({ label, value, onChange, error, textarea = false }: { label: string; value: string; onChange: (value: string) => void; error?: string; textarea?: boolean }) {
  const id = label.toLowerCase();
  const common = { id, value, onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value), "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined, className: "input" };
  return <label className="mb-5 block text-sm font-medium text-[var(--text)]">{label}{textarea ? <textarea {...common} rows={5} /> : <input {...common} type="text" autoComplete="name" />}{error && <span id={`${id}-error`} className="field-error">{error}</span>}</label>;
}
