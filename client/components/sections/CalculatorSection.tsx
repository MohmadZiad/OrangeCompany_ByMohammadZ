"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/components/providers/language-provider";
import { uiStrings } from "@/lib/i18n";

export function CalculatorSection() {
  const { locale } = useLanguage();

  return (
    <section id="calculator" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-8">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-semibold text-[var(--text-1)] dark:text-white">
              {uiStrings.calculatorTitle[locale]}
            </h3>
            <span className="rounded-full border border-white/40 bg-white/50 px-3 py-1 text-xs uppercase tracking-wide text-[var(--text-2)] dark:border-white/10 dark:bg-white/10 dark:text-white/60">
              {locale === "en" ? "Formula" : "معادلة"}
            </span>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/60 p-4 text-sm text-[var(--text-2)] shadow-inner dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            <code className="block font-mono">
              margin = revenue × (1 - cost_ratio) - incentives
            </code>
          </div>
          <form className="grid gap-4 md:grid-cols-2">
            {[
              { key: "revenue", label: { en: "Revenue", ar: "الإيراد" }, placeholder: "75000" },
              { key: "cost", label: { en: "Cost", ar: "التكلفة" }, placeholder: "19500" },
              { key: "ratio", label: { en: "Cost ratio", ar: "نسبة التكلفة" }, placeholder: "0.24" },
              { key: "incentives", label: { en: "Incentives", ar: "الحوافز" }, placeholder: "3000" },
            ].map((item) => (
              <label key={item.key} className="space-y-2">
                <span className="block text-xs font-medium uppercase tracking-wide text-[var(--text-2)] dark:text-white/60">
                  {item.label[locale]}
                </span>
                <input
                  className="w-full rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm text-[var(--text-1)] shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--orange-400)] dark:border-white/10 dark:bg-white/5 dark:text-white"
                  placeholder={item.placeholder}
                  type="number"
                  inputMode="decimal"
                />
              </label>
            ))}
          </form>
          <motion.button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--orange-500)] via-[var(--orange-400)] to-[var(--orange-200)] px-6 py-3 font-medium text-white shadow-[0_25px_40px_-24px_rgba(255,122,26,0.9)] transition-transform hover:-translate-y-0.5"
            whileTap={{ scale: 0.97 }}
          >
            {locale === "en" ? "Compute margin" : "احسب الهامش"}
          </motion.button>
        </motion.div>
      </Card>
      <Card className="p-6">
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.42, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <h4 className="font-display text-xl text-[var(--text-1)] dark:text-white">
              {locale === "en" ? "Guided input" : "إدخال موجّه"}
            </h4>
            <p className="mt-2 text-sm text-[var(--text-2)] dark:text-white/70">
              {locale === "en"
                ? "Sync with the assistant to pre-fill current period values and compare deltas instantly."
                : "زامن مع المساعد لملء قيم الفترة الحالية ومقارنة الفوارق فورًا."}
            </p>
          </div>
          <ul className="space-y-3 text-sm text-[var(--text-2)] dark:text-white/65">
            <li>• {locale === "en" ? "Drag values from spreadsheets" : "اسحب القيم من الجداول"}</li>
            <li>• {locale === "en" ? "Share formula snapshots" : "شارك لقطات المعادلات"}</li>
            <li>• {locale === "en" ? "Audit with timestamped comments" : "تدقيق بتعليقات مختومة زمنياً"}</li>
          </ul>
        </motion.div>
      </Card>
    </section>
  );
}
