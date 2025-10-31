"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/components/providers/language-provider";
import { uiStrings } from "@/lib/i18n";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Jan", value: 32 },
  { name: "Feb", value: 38 },
  { name: "Mar", value: 46 },
  { name: "Apr", value: 44 },
  { name: "May", value: 52 },
  { name: "Jun", value: 61 },
];

export function ProRataSection() {
  const { locale } = useLanguage();

  return (
    <section id="pro-rata" className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card className="p-8">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-semibold text-[var(--text-1)] dark:text-white">
              {uiStrings.proRataTitle[locale]}
            </h3>
            <span className="rounded-full bg-[var(--orange-100)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--orange-600)] dark:bg-white/10 dark:text-white/70">
              {locale === "en" ? "Live" : "لحظي"}
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-[var(--text-2)] dark:text-white/70">
              <span>{locale === "en" ? "Target coverage" : "نسبة التغطية"}</span>
              <span>75%</span>
            </div>
            <div className="h-3 rounded-full bg-[color:rgba(0,0,0,0.08)] dark:bg-white/10">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-[var(--orange-500)] via-[var(--orange-300)] to-[var(--orange-100)]"
                initial={{ width: "0%" }}
                animate={{ width: "75%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
          <div className="h-60 w-full overflow-hidden rounded-3xl border border-white/20 bg-white/60 p-4 shadow-inner dark:border-white/10 dark:bg-white/5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF7A1A" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#FFE7D6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(0,0,0,0.08)" strokeDasharray="4 8" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(0,0,0,0.35)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(0,0,0,0.35)" tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(255,122,26,0.2)", backgroundColor: "rgba(255,255,255,0.9)", color: "#0E0E0E" }} />
                <Area type="monotone" dataKey="value" stroke="#FF7A1A" strokeWidth={2.6} fill="url(#orangeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </Card>
      <Card className="p-8">
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.42, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <h4 className="font-display text-xl font-semibold text-[var(--text-1)] dark:text-white">
            {locale === "en" ? "Scenario play" : "لعب السيناريو"}
          </h4>
          <p className="text-sm text-[var(--text-2)] dark:text-white/70">
            {locale === "en"
              ? "Compare planned vs. actual distribution, align stakeholders, and export to governance logs."
              : "قارن المخطط بالفعلي، ونسّق مع المعنيين، وصدّر إلى سجلات الحوكمة."}
          </p>
          <ul className="space-y-3 text-sm text-[var(--text-2)] dark:text-white/70">
            <li>• {locale === "en" ? "Smart tiers based on engagement" : "شرائح ذكية حسب التفاعل"}</li>
            <li>• {locale === "en" ? "Auto alerts for variance" : "تنبيهات تلقائية للفروقات"}</li>
            <li>• {locale === "en" ? "Historical overlays" : "تراكب تاريخي"}</li>
          </ul>
        </motion.div>
      </Card>
    </section>
  );
}
