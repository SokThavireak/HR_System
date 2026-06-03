import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const dialogVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.97,
    transition: { duration: 0.15 },
  },
};

export function Modal({ open, onClose, title, children, footer }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
            <div className="px-6 py-4">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
