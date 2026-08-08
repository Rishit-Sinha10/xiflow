"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion as useFramerReducedMotion } from "framer-motion";

export function useReducedMotion() {
  const reduce = useFramerReducedMotion();
  const [value, setValue] = useState(null);
  useEffect(() => {
    if (reduce === null) return;
    setValue(reduce);
  }, [reduce]);
  return value;
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.6,
  className = "",
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
