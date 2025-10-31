"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { uiStrings } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const toggle = () => setLocale(locale === "en" ? "ar" : "en");

  return (
    <motion.button
      type="button"
      onClick={toggle}
      className="flex items-center gap-2 rounded-2xl border border-white/40 bg-white/60 px-4 py-2 text-sm font-medium text-[var(--text-1)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[color:rgba(17,17,17,0.78)] dark:text-white/90"
      whileTap={{ scale: 0.97 }}
      aria-label={locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
    >
      <Languages className="h-4 w-4" />
      <span>{uiStrings.languageLabel[locale]}</span>
      <motion.span
        key={locale}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="text-xs uppercase text-[var(--text-2)]"
      >
        {locale}
      </motion.span>
    </motion.button>
  );
}
