import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="mb-10 max-w-2xl"><p className="eyebrow">{eyebrow}</p><h2 className="section-title">{title}</h2>{children && <p className="section-copy">{children}</p>}</div>;
}

export function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return <a className="icon-button" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} aria-label={label}>{children}</a>;
}
