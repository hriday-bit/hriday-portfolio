import { lazy, Suspense, useEffect, useState } from "react";
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
import { Work } from "./components/Work";
import { SiteContentProvider } from "./content";

const AdminLogin = lazy(() => import("./components/Admin").then((module) => ({ default: module.AdminLogin })));
const AdminPanel = lazy(() => import("./components/Admin").then((module) => ({ default: module.AdminPanel })));
const AdminRoute = lazy(() => import("./components/Admin").then((module) => ({ default: module.AdminRoute })));

type Theme = "dark" | "light";
type Toast = { kind: "success" | "error"; message: string } | null;

function Portfolio() {
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem("theme") === "light" ? "light" : "dark");
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("theme", theme); }, [theme]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), 5000); return () => window.clearTimeout(timer); }, [toast]);
  return <SiteContentProvider><Navbar theme={theme} setTheme={setTheme} /><main><Hero /><Work /><Projects /><About /><Skills /><Services /><OpenTo /><Contact onToast={setToast} /></main><Footer /><AnimatePresence>{toast && <motion.div className={`toast toast-${toast.kind}`} role="status" aria-live="polite" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>{toast.message}<button onClick={() => setToast(null)} aria-label="Dismiss notification"><FaTimes /></button></motion.div>}</AnimatePresence></SiteContentProvider>;
}

function AdminLoading() { return <main className="admin-shell"><p className="text-[var(--muted)]">Loading private area…</p></main>; }

export default function App() { return <Routes><Route path="/" element={<Portfolio />} /><Route path="/admin/login" element={<Suspense fallback={<AdminLoading />}><AdminLogin /></Suspense>} /><Route path="/admin" element={<Suspense fallback={<AdminLoading />}><AdminRoute><AdminPanel /></AdminRoute></Suspense>} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>; }
