"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { uiStrings } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";
import Link from "next/link";

export function Header() {
  const { locale } = useLanguage();
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);
  const opacity = useTransform(scrollY, [0, 80], [0.1, 0.92]);

  useEffect(() => setMounted(true), []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4"
      style={{ backdropFilter: "blur(16px)" }}
      animate={{ y: mounted ? 0 : -20, opacity: mounted ? 1 : 0 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        style={{ opacity }}
        className="pointer-events-none absolute inset-0 rounded-3xl border border-white/30 bg-white/60 shadow-lg dark:border-white/10 dark:bg-[color:rgba(15,15,15,0.78)]"
      />
      <div className="relative flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--orange-500)] text-white shadow-[0_10px_40px_-15px_rgba(255,122,26,0.8)]">
          <span className="text-lg font-semibold">OT</span>
        </div>
        <div className="relative flex flex-col">
          <span className="font-display text-lg font-semibold text-[var(--text-1)] dark:text-white">
            Orange Tool
          </span>
          <span className="text-xs text-[var(--text-2)] dark:text-white/70">
            {uiStrings.heroFootnote[locale]}
          </span>
        </div>
      </div>
      <div className="relative flex flex-1 items-center justify-end gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        <motion.div whileTap={{ scale: 0.97 }}>
          <Link
            href="#assistant"
            className="relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-[var(--orange-500)] via-[var(--orange-400)] to-[var(--orange-200)] px-5 py-2.5 font-medium text-white shadow-[0_20px_30px_-18px_rgba(255,122,26,0.9)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--orange-500)]"
          >
            <span>{uiStrings.openAssistant[locale]}</span>
            <span className="rounded-full bg-white/25 px-2 text-xs font-semibold uppercase tracking-wider">
              {uiStrings.betaBadge[locale]}
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
}
