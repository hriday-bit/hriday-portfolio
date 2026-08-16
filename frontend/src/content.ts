import { FaCode, FaGlobe, FaRocket, FaServer } from "react-icons/fa";

export const SITE_URL = "https://hriday-portfolio.vercel.app/";
export const GITHUB_URL = "https://github.com/hriday-bit";
export const LINKEDIN_URL = "https://linkedin.com/in/hriday-saluja-1a2562384";
export const EMAIL = "hridaysaluja2@gmail.com";

// Replace this line when availability changes.
export const availability = "Open to full-time full-stack opportunities and available for select freelance projects.";

export const services = [
  { title: "Business Websites", description: "Fast, credible websites designed to turn visitors into inquiries.", icon: FaGlobe },
  { title: "Full-Stack Web Apps", description: "Complete applications with a polished interface, API, and data layer.", icon: FaCode },
  { title: "API & Backend Development", description: "Structured, reliable APIs that make product ideas work end to end.", icon: FaServer },
  { title: "Startup MVPs", description: "Focused first versions that help teams validate a useful product quickly.", icon: FaRocket },
] as const;

// Placeholder: replace with a real client quote, name, and role when available.
export const testimonial = {
  quote: "“Placeholder testimonial: describe the business result, collaboration, and experience of working together.”",
  name: "Client name",
  role: "Client role / company",
};
