"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Maximize2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function Dock() {
  const [progress, setProgress] = useState(42);
  const { locale } = useLanguage();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) => (prev >= 96 ? 8 : prev + 4));
    }, 2400);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40 flex items-center gap-4 rounded-3xl border border-white/30 bg-white/80 px-5 py-3 shadow-[0_20px_45px_-25px_rgba(0,0,0,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-[color:rgba(18,18,18,0.8)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--orange-500)] via-[var(--orange-400)] to-[var(--orange-200)] text-white shadow-[0_20px_40px_-22px_rgba(255,122,26,0.9)]"
        aria-label={locale === "en" ? "Expand" : "توسيع"}
      >
        <Maximize2 className="h-5 w-5" />
      </motion.button>
      <div className="w-40">
        <div className="flex items-center justify-between text-xs text-[var(--text-2)] dark:text-white/70">
          <span>{locale === "en" ? "Processing" : "جاري المعالجة"}</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-[color:rgba(0,0,0,0.08)] dark:bg-white/10">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-[var(--orange-500)] via-[var(--orange-300)] to-[var(--orange-100)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}
