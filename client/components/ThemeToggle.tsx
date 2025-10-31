"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <motion.button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/40 bg-white/60 text-[var(--text-1)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        "dark:border-white/10 dark:bg-[color:rgba(17,17,17,0.8)] dark:text-white/90",
      )}
      whileTap={{ scale: 0.96 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -15, opacity: 0, scale: 0.9 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-5 w-5 items-center justify-center"
      >
        {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </motion.span>
    </motion.button>
  );
}
