"use client";

import { motion } from "framer-motion";
import { uiStrings } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";
import { Card } from "@/components/ui/Card";
import { BookOpen, Sparkles, Zap, Layers } from "lucide-react";

const icons = [Zap, Sparkles, BookOpen, Layers];

export function FeatureGrid() {
  const { locale } = useLanguage();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-[var(--text-1)] dark:text-white">
          {uiStrings.featureHeadline[locale]}
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {uiStrings.features.map((feature, index) => {
          const Icon = icons[index % icons.length];
          return (
            <Card key={feature.title.en} className="p-7">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.36, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-120px" }}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--orange-100)] text-[var(--orange-500)] shadow-inner shadow-[rgba(255,122,26,0.18)] dark:bg-white/10 dark:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[var(--text-1)] dark:text-white">
                    {feature.title[locale]}
                  </h3>
                  <p className="text-sm text-[var(--text-2)] dark:text-white/70">
                    {feature.description[locale]}
                  </p>
                </div>
              </motion.div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
