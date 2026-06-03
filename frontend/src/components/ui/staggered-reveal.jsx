import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const slideInLeftVariants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 22,
    },
  },
};

/**
 * StaggeredReveal — wraps children in a staggered entrance animation.
 *
 * Props:
 *   variant   — "fadeUp" (default) | "slideLeft" | "scale" | "item"
 *   stagger   — delay between each child (seconds, default 0.08)
 *   delay     — initial delay before first child (seconds, default 0.1)
 *   className — optional wrapper class
 */
export function StaggeredReveal({
  children,
  variant = "fadeUp",
  stagger = 0.08,
  delay = 0.1,
  className = "",
}) {
  const variantsMap = {
    fadeUp: fadeUpVariants,
    slideLeft: slideInLeftVariants,
    scale: scaleInVariants,
    item: itemVariants,
  };

  const v = variantsMap[variant] || fadeUpVariants;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div variants={v} style={{ willChange: "transform, opacity" }}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/**
 * StaggerItem — individual animated item that triggers when scrolled into view.
 * Use when you need mixed content (some animated, some not) inside a stagger container.
 */
export function StaggerItem({ children, className = "", amount = 0.25 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount, margin: "-10% 0px -10% 0px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollReveal — triggers animation when element scrolls into view.
 * Uses framer-motion's whileInView for scroll-triggered staggered entrance.
 *
 * Props:
 *   variant    — "fadeUp" (default) | "slideLeft" | "scale" | "item"
 *   stagger    — delay between each child (seconds, default 0.1)
 *   delay      — initial delay before first child (seconds, default 0)
 *   className  — optional wrapper class
 *   amount     — fraction of element that must be visible to trigger (0-1, default 0.15)
 *   rootMargin — viewport margin shorthand, "-20% 0px -20% 0px" shrinks trigger zone
 */
export function ScrollReveal({
  children,
  variant = "fadeUp",
  stagger = 0.1,
  delay = 0,
  className = "",
  amount = 0.25,
  rootMargin = "-10% 0px -10% 0px",
}) {
  const variantsMap = {
    fadeUp: fadeUpVariants,
    slideLeft: slideInLeftVariants,
    scale: scaleInVariants,
    item: itemVariants,
  };

  const v = variantsMap[variant] || fadeUpVariants;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount, margin: rootMargin });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const animateState = hasAnimated ? "visible" : "hidden";

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      initial="hidden"
      animate={animateState}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div variants={v} style={{ willChange: "transform, opacity" }}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default StaggeredReveal;
