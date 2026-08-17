import type { Variants } from "framer-motion";

export const motionTokens = {
  interaction: 0.18,
  standard: 0.34,
  editorial: 0.52,
  technical: 0.6,
  stagger: 0.075,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const editorialContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: motionTokens.stagger } },
};

export const editorialReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: motionTokens.editorial, ease: motionTokens.ease } },
};

export const editorialLineReveal: Variants = {
  hidden: { opacity: 0, y: "105%" },
  visible: { opacity: 1, y: "0%", transition: { duration: motionTokens.editorial, ease: motionTokens.ease } },
};

export const contentReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: motionTokens.standard, ease: motionTokens.ease } },
};

export function supportsFinePointer() {
  return typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
