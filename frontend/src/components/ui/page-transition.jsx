import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Preset variant definitions ─── */
const variants = {
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  slideUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * PageTransition — wraps page content in animated transitions.
 *
 * Props:
 *   variant     — "fadeUp" (default) | "fadeIn" | "slideLeft" | "slideUp" | "scaleUp"
 *   keyProp     — unique key to trigger exit/enter (e.g. tab key or route)
 *   className   — optional wrapper class
 *   children    — content to animate
 */
export function PageTransition({ variant = "fadeUp", keyProp, className = "", children }) {
  const v = variants[variant] || variants.fadeUp;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyProp}
        initial={v.initial}
        animate={v.animate}
        exit={v.exit}
        transition={v.transition}
        className={className}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
