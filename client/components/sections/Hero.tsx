"use client";

import { motion } from "framer-motion";
import { GradientBG } from "@/components/GradientBG";
import { uiStrings } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";
import Link from "next/link";

export function Hero() {
  const { locale } = useLanguage();

  return (
    <section className="relative isolate flex min-h-[640px] flex-col justify-center overflow-hidden rounded-3xl border border-white/25 bg-white/80 px-8 py-16 shadow-[0_40px_90px_-45px_rgba(255,122,26,0.85)] dark:border-white/10 dark:bg-[color:rgba(16,16,16,0.7)]">
      <GradientBG />
      <motion.div
        className="relative z-10 max-w-3xl space-y-6 text-balance"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 text-sm font-medium text-[var(--text-2)] shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white/80">
          <span className="h-2 w-2 rounded-full bg-[var(--orange-500)]" /> Live sync · {uiStrings.heroFootnote[locale]}
        </span>
        <h1 className="font-display text-5xl font-semibold leading-tight text-[var(--text-1)] dark:text-white">
          {uiStrings.heroTitle[locale]}
        </h1>
        <p className="max-w-xl text-lg text-[var(--text-2)] dark:text-white/80">
          {uiStrings.heroSubtitle[locale]}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href="#assistant"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-[var(--orange-500)] via-[var(--orange-400)] to-[var(--orange-200)] px-6 py-3 font-medium text-white shadow-[0_25px_40px_-25px_rgba(255,122,26,0.9)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--orange-500)]"
            >
              {uiStrings.openAssistant[locale]}
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href="#calculator"
              className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-6 py-3 font-medium text-[var(--text-1)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              {uiStrings.launchCalculator[locale]}
            </Link>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="absolute right-6 top-10 hidden h-48 w-48 rounded-3xl border border-white/50 bg-white/40 backdrop-blur-3xl dark:border-white/10 dark:bg-white/5 lg:block"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute inset-4 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(255,122,26,0.35),_transparent_70%)]"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
