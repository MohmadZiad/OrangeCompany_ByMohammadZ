"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { KpiCards } from "@/components/sections/KpiCards";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { SummaryPanel } from "@/components/sections/SummaryPanel";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { ProRataSection } from "@/components/sections/ProRataSection";
import { AssistantSection } from "@/components/sections/AssistantSection";
import { DocsSection } from "@/components/sections/DocsSection";
import { Dock } from "@/components/Dock";
import { SplashScreen } from "@/components/SplashScreen";
import { motion } from "framer-motion";

export function OrangeLanding() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg-light)] text-[var(--text-1)] dark:bg-[var(--bg-dark)] dark:text-white">
      <SplashScreen />
      <Header />
      <main className="relative z-10 mx-auto mt-32 flex max-w-6xl flex-col gap-16 px-6 pb-24">
        <Hero />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-16"
        >
          <KpiCards />
          <FeatureGrid />
          <SummaryPanel />
          <CalculatorSection />
          <ProRataSection />
          <AssistantSection />
          <DocsSection />
        </motion.div>
      </main>
      <Dock />
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10 bg-[var(--grad-glow)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
