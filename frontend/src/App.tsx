import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { Navigate, Route, Routes } from "react-router-dom";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { OpenTo } from "./components/OpenTo";
import { Projects } from "./components/Projects";
import { Services } from "./components/Services";
import { Skills } from "./components/Skills";
import { Testimonial } from "./components/Testimonial";

type Theme = "dark" | "light";
type Toast = { kind: "success" | "error"; message: string } | null;

function Portfolio() {
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem("theme") === "light" ? "light" : "dark");
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("theme", theme); }, [theme]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), 5000); return () => window.clearTimeout(timer); }, [toast]);
  return <><Navbar theme={theme} setTheme={setTheme} /><main><Hero /><About /><Skills /><Services /><Testimonial /><Projects /><OpenTo /><Contact onToast={setToast} /></main><Footer /><AnimatePresence>{toast && <motion.div className={`toast toast-${toast.kind}`} role="status" aria-live="polite" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>{toast.message}<button onClick={() => setToast(null)} aria-label="Dismiss notification"><FaTimes /></button></motion.div>}</AnimatePresence></>;
}

export default function App() { return <Routes><Route path="/" element={<Portfolio />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>; }
