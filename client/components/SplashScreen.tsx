"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const STORAGE_KEY = "orange-tool-splash";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasSeen = window.localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      setVisible(true);
      const timeout = window.setTimeout(() => {
        setVisible(false);
        window.localStorage.setItem(STORAGE_KEY, "true");
      }, 1200);
      return () => window.clearTimeout(timeout);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--grad-hero)]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative flex h-40 w-40 items-center justify-center rounded-[40px] bg-white/40 shadow-[0_30px_60px_-30px_rgba(255,122,26,0.9)] backdrop-blur-2xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-4 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(255,122,26,0.35),_transparent_70%)]"
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            />
            <motion.span
              className="relative text-3xl font-display font-semibold text-[var(--text-1)]"
              initial={{ filter: "blur(12px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 0.48, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              Orange Tool
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
