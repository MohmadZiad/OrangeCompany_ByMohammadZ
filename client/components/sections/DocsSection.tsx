"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/components/providers/language-provider";
import { uiStrings } from "@/lib/i18n";
import { Search, FileText } from "lucide-react";

const docs = [
  { id: "doc-1", title: { en: "Incident response", ar: "التعامل مع الحوادث" }, tag: "Playbook" },
  { id: "doc-2", title: { en: "Assistant hand-offs", ar: "تسليمات المساعد" }, tag: "Guides" },
  { id: "doc-3", title: { en: "Pro-rata governance", ar: "حوكمة البرو راتا" }, tag: "Policy" },
  { id: "doc-4", title: { en: "API references", ar: "مراجع الواجهة" }, tag: "Reference" },
];

export function DocsSection() {
  const { locale } = useLanguage();

  return (
    <section id="docs" className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <Card className="p-8">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-semibold text-[var(--text-1)] dark:text-white">
              {uiStrings.docsTitle[locale]}
            </h3>
            <span className="rounded-full border border-white/40 bg-white/60 px-3 py-1 text-xs uppercase tracking-wide text-[var(--text-2)] dark:border-white/10 dark:bg-white/10 dark:text-white/60">
              {locale === "en" ? "Instant" : "فوري"}
            </span>
          </div>
          <label className="group flex items-center gap-3 rounded-full border border-white/40 bg-white/60 px-5 py-3 text-sm text-[var(--text-1)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-within:-translate-y-0.5 focus-within:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-white">
            <Search className="h-4 w-4 text-[var(--text-2)]" />
            <input
              type="search"
              placeholder={uiStrings.docsSearchPlaceholder[locale]}
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <div className="grid gap-4">
            {docs.map((doc, index) => (
              <motion.div
                key={doc.id}
                className="flex items-center justify-between rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-sm text-[var(--text-1)] shadow-[0_10px_25px_-20px_rgba(0,0,0,0.35)] transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-80px" }}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--orange-100)] text-[var(--orange-500)] shadow-inner shadow-[rgba(255,122,26,0.18)] dark:bg-white/10 dark:text-white">
                    <FileText className="h-4 w-4" />
                  </span>
                  {doc.title[locale]}
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs uppercase tracking-wide text-[var(--text-2)] dark:bg-white/10 dark:text-white/60">
                  {doc.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Card>
      <Card className="p-8">
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.42, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <h4 className="font-display text-xl font-semibold text-[var(--text-1)] dark:text-white">
            {locale === "en" ? "Glass archive" : "أرشيف زجاجي"}
          </h4>
          <p className="text-sm text-[var(--text-2)] dark:text-white/70">
            {locale === "en"
              ? "A translucent workspace where every document is synced, versioned, and searchable without friction."
              : "مساحة شفافة تُزامن كل الوثائق وتُفهرسها بإصدارات قابلة للبحث دون عناء."}
          </p>
          <ul className="space-y-3 text-sm text-[var(--text-2)] dark:text-white/70">
            <li>• {locale === "en" ? "Real-time co-editing" : "تعاون لحظي"}</li>
            <li>• {locale === "en" ? "In-context approvals" : "موافقات سياقية"}</li>
            <li>• {locale === "en" ? "Schema aware" : "واعية للمخططات"}</li>
          </ul>
        </motion.div>
      </Card>
    </section>
  );
}
