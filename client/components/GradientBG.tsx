"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function GradientBG() {
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 600], [0, -120]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,122,26,0.25),_transparent_70%)]"
        style={{ y: glowY }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-[580px] bg-[var(--grad-hero)] opacity-70 blur-3xl dark:opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.svg
        className="absolute -right-20 top-32 h-72 w-72 opacity-70"
        viewBox="0 0 400 400"
        initial={{ rotate: -12, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFE7D6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke="url(#grad)"
          strokeWidth="1.4"
          strokeDasharray="4 12"
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        />
      </motion.svg>
    </div>
  );
}
