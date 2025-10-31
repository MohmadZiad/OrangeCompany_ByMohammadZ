"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { uiStrings } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";
import { formatNumber } from "@/lib/utils";

const mockEvents = [
  { id: "evt-01", type: "deployment", value: 6.7 },
  { id: "evt-02", type: "rollback", value: -2.1 },
  { id: "evt-03", type: "sync", value: 3.2 },
  { id: "evt-04", type: "assistant", value: 1.2 },
];

export function SummaryPanel() {
  const { locale } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % mockEvents.length);
    }, 2600);
    return () => window.clearInterval(interval);
  }, []);

  const active = mockEvents[index];

  const label = useMemo(() => {
    switch (active.type) {
      case "deployment":
        return { en: "Deploy velocity", ar: "سرعة الإطلاق" };
      case "rollback":
        return { en: "Rollback delta", ar: "فارق التراجع" };
      case "sync":
        return { en: "Knowledge sync", ar: "مزامنة المعرفة" };
      case "assistant":
        return { en: "Assistant uplift", ar: "أثر المساعد" };
      default:
        return { en: "Live signal", ar: "إشارة حية" };
    }
  }, [active.type]);

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card className="p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-[var(--text-1)] dark:text-white">
            {uiStrings.summaryHeadline[locale]}
          </h2>
          <span className="rounded-full bg-[var(--orange-100)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--orange-600)] dark:bg-white/10 dark:text-white/70">
            Live feed
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6" hover={false}>
            <p className="text-sm text-[var(--text-2)] dark:text-white/70">{label[locale]}</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={active.id}
                className="font-display text-4xl font-semibold text-[var(--text-1)] dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                {formatNumber(Math.abs(active.value), {
                  locale,
                  maximumFractionDigits: 1,
                })}
                <span className="ml-1 text-lg text-[var(--text-2)] dark:text-white/60">
                  {active.value > 0 ? "+" : "-"}
                </span>
              </motion.p>
            </AnimatePresence>
            <p className="mt-3 text-xs text-[var(--text-2)] dark:text-white/50">
              {locale === "en"
                ? "Rolling averages update every 45 seconds."
                : "يتم تحديث المتوسطات كل ٤٥ ثانية."}
            </p>
          </Card>
          <Card className="p-6" hover={false}>
            <p className="text-sm text-[var(--text-2)] dark:text-white/70">
              {locale === "en" ? "Active orchestrations" : "عمليات التنسيق النشطة"}
            </p>
            <motion.div
              className="mt-4 space-y-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-80px" }}
            >
              {[18, 7, 3].map((value, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-2)] dark:text-white/70">
                    {locale === "en" ? `Playbook ${idx + 1}` : `بلايبوك ${idx + 1}`}
                  </span>
                  <motion.div
                    className="h-2 w-32 rounded-full bg-[color:rgba(255,255,255,0.4)] dark:bg-white/10"
                  >
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-[var(--orange-500)] via-[var(--orange-300)] to-[var(--orange-100)]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${value * 3}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </Card>
        </div>
      </Card>
      <Card className="flex flex-col justify-between gap-6 p-8">
        <div>
          <h3 className="font-display text-xl font-semibold text-[var(--text-1)] dark:text-white">
            {uiStrings.calculatorTitle[locale]}
          </h3>
          <p className="mt-2 text-sm text-[var(--text-2)] dark:text-white/70">
            {locale === "en"
              ? "Estimate contribution margins with collaborative commentary."
              : "قدِّر هوامش المساهمة مع تعليقات تعاونية."}
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--text-2)] dark:text-white/60">
              {locale === "en" ? "Monthly revenue" : "الإيراد الشهري"}
            </label>
            <input
              type="number"
              placeholder="45000"
              className="w-full rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm text-[var(--text-1)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--orange-400)] dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--text-2)] dark:text-white/60">
              {locale === "en" ? "Operational cost" : "التكلفة التشغيلية"}
            </label>
            <input
              type="number"
              placeholder="12000"
              className="w-full rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm text-[var(--text-1)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--orange-400)] dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>
        <motion.button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--orange-500)] via-[var(--orange-400)] to-[var(--orange-200)] px-5 py-3 font-medium text-white shadow-[0_20px_40px_-20px_rgba(255,122,26,0.9)] transition-transform hover:-translate-y-0.5"
          whileTap={{ scale: 0.97 }}
        >
          {locale === "en" ? "Recalculate" : "أعد الحساب"}
        </motion.button>
      </Card>
    </section>
  );
}
