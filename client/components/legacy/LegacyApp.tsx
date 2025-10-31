"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function LegacyApp() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
      <motion.div
        className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-white/20 bg-white/5 p-10 text-center shadow-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-sm uppercase tracking-[0.35em] text-white/60">Legacy interface</p>
        <h1 className="text-4xl font-semibold">Orange Tool classic</h1>
        <p className="text-base text-white/70">
          The previous Orange Tool interface is still available for reference. Enable the new design via
          <code className="mx-2 rounded-full bg-white/10 px-2 py-1 text-sm">NEXT_PUBLIC_ORANGE_NEW_UI=true</code>
          to explore the refreshed experience.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-3 font-medium text-white transition-all hover:-translate-y-1 hover:bg-white/20"
        >
          Return home
        </Link>
      </motion.div>
    </div>
  );
}
