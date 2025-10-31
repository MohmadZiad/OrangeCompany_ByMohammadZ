"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "orange-tool-language";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && (stored === "en" || stored === "ar")) {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";
    html.dataset.locale = locale;
    html.classList.toggle("rtl", locale === "ar");
  }, [locale]);

  const setLocale = (value: Locale) => {
    setLocaleState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  };

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
