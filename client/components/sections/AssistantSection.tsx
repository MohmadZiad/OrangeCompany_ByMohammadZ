"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/components/providers/language-provider";
import { uiStrings } from "@/lib/i18n";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

const messages = [
  {
    id: "msg-1",
    author: "assistant",
    content: {
      en: "Synthesizing metrics: response latency improving 8% week-over-week.",
      ar: "أحلّل المؤشرات: زمن الاستجابة يتحسن بنسبة ٨٪ أسبوعيًا.",
    },
  },
  {
    id: "msg-2",
    author: "user",
    content: {
      en: "Trigger the escalation playbook if latency crosses 3.5s.",
      ar: "فعّل بروتوكول التصعيد إذا تجاوز الزمن ٣٫٥ ثانية.",
    },
  },
  {
    id: "msg-3",
    author: "assistant",
    content: {
      en: "Done. Monitoring window extended and notifications dispatched.",
      ar: "تم. تم تمديد نافذة المراقبة وإرسال التنبيهات.",
    },
  },
];

export function AssistantSection() {
  const { locale } = useLanguage();

  return (
    <section id="assistant" className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
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
              {uiStrings.assistantTitle[locale]}
            </h3>
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-3 py-1 text-xs uppercase tracking-widest text-[var(--text-2)] dark:border-white/10 dark:bg-white/10 dark:text-white/60"
              animate={{ boxShadow: ["0 0 0 rgba(255,122,26,0)", "0 0 32px rgba(255,122,26,0.35)", "0 0 0 rgba(255,122,26,0)"] }}
              transition={{ repeat: Infinity, duration: 6 }}
            >
              <Sparkles className="h-4 w-4 text-[var(--orange-500)]" />
              AI
            </motion.span>
          </div>
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={cn(
                  "relative w-fit max-w-xl rounded-3xl border border-white/30 px-5 py-3 text-sm text-[var(--text-1)] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] transition-transform dark:border-white/10 dark:text-white",
                  message.author === "assistant"
                    ? "bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-white/10 dark:via-white/5 dark:to-white/0"
                    : "ml-auto bg-[var(--orange-500)] text-white shadow-[0_18px_35px_-20px_rgba(255,122,26,0.65)]",
                )}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-120px" }}
              >
                <div
                  className={cn(
                    "mb-2 flex items-center gap-2 text-xs uppercase tracking-wide",
                    message.author === "assistant"
                      ? "text-[var(--text-2)] dark:text-white/60"
                      : "text-white/80",
                  )}
                >
                  {message.author === "assistant" ? (
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-[var(--orange-500)]" />
                      {locale === "en" ? "Assistant" : "المساعد"}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {locale === "en" ? "Operator" : "المشغّل"}
                    </span>
                  )}
                </div>
                <p>{message.content[locale]}</p>
                {message.author === "assistant" && (
                  <span className="mt-3 block h-0.5 w-14 rounded-full bg-gradient-to-r from-[var(--orange-500)] via-[var(--orange-300)] to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Card>
      <Card className="flex flex-col justify-between gap-4 p-8">
        <div>
          <h4 className="font-display text-xl font-semibold text-[var(--text-1)] dark:text-white">
            {locale === "en" ? "Escalation comfort" : "راحة التصعيد"}
          </h4>
          <p className="mt-2 text-sm text-[var(--text-2)] dark:text-white/70">
            {locale === "en"
              ? "Tap into live experts instantly, with contextual transcripts and approvals handled."
              : "اتصل بخبراء مباشرين فورًا، مع نسخ سياقية وإجراءات موافقة جاهزة."}
          </p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--orange-500)] via-[var(--orange-400)] to-[var(--orange-200)] px-5 py-3 font-medium text-white shadow-[0_18px_40px_-22px_rgba(255,122,26,0.9)]"
        >
          {uiStrings.assistantCTA[locale]}
        </motion.button>
        <motion.div
          className="mt-6 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/60 p-4 text-sm text-[var(--text-2)] dark:border-white/10 dark:bg-white/5 dark:text-white/70"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.42, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-[var(--orange-100)] text-[var(--orange-500)] shadow-inner shadow-[rgba(255,122,26,0.18)] dark:bg-white/10 dark:text-white">
            <motion.span
              className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,122,26,0.35),_transparent_70%)]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 5 }}
            />
            <Sparkles className="relative h-4 w-4" />
          </span>
          <span>
            {locale === "en"
              ? "Typing indicators, turn-by-turn audits, and multi-lingual understanding are built-in."
              : "مؤشرات الكتابة والتدقيق خطوة بخطوة وفهم متعدد اللغات كلها مدمجة."}
          </span>
        </motion.div>
      </Card>
    </section>
  );
}
