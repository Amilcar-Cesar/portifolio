"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fonts = [
  { 
    id: "jetbrains", 
    fontFamily: "var(--font-jetbrains-mono), monospace" 
  },
  { 
    id: "fira", 
    fontFamily: "var(--font-fira-code), monospace" 
  },
  { 
    id: "space", 
    fontFamily: "var(--font-space-mono), monospace" 
  },
  { 
    id: "courier", 
    fontFamily: "var(--font-courier-prime), monospace" 
  },
];

export default function AnimatedName() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % fonts.length);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  const currentFont = fonts[index];

  return (
    <span className="relative inline-block select-none align-baseline whitespace-nowrap">
      {/* Reserved bounding box using the widest font to prevent ANY layout shift */}
      <span
        aria-hidden="true"
        style={{ fontFamily: "var(--font-space-mono), monospace" }}
        className="invisible select-none inline-block font-bold"
      >
        amilcar.
      </span>

      {/* Absolutely positioned animated text overlay */}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentFont.id}
          style={{ fontFamily: currentFont.fontFamily }}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(3px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(3px)" }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0 text-accent font-bold inline-block whitespace-nowrap"
        >
          amilcar.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
