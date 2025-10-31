"use client";

import { motion } from "framer-motion";
import { uiStrings } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";
import { Card } from "@/components/ui/Card";

export function KpiCards() {
  const { locale } = useLanguage();

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {uiStrings.kpis.map((kpi, index) => (
        <Card key={kpi.label.en}>
          <motion.div
            className="flex h-full flex-col justify-between gap-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="space-y-2">
              <span className="text-sm uppercase tracking-widest text-[var(--text-2)] dark:text-white/60">
                {kpi.label[locale]}
              </span>
              <p className="font-display text-3xl font-semibold text-[var(--text-1)] dark:text-white">
                {kpi.value[locale]}
              </p>
            </div>
            <p className="text-sm text-[var(--text-2)] dark:text-white/70">{kpi.caption[locale]}</p>
            <motion.span
              className="block h-1 rounded-full bg-gradient-to-r from-[var(--orange-500)] via-[var(--orange-300)] to-transparent"
              animate={{
                backgroundPositionX: ["0%", "100%", "0%"],
              }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              style={{ backgroundSize: "200%" }}
            />
          </motion.div>
        </Card>
      ))}
    </div>
  );
}
