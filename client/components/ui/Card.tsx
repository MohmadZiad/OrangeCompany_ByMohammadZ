"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Card({
  className,
  children,
  hover = true,
}: {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/20 bg-white/75 p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.35)] transition-colors dark:border-white/10 dark:bg-[color:rgba(18,18,18,0.7)]",
        hover && "group",
        className,
      )}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {hover && (
        <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-white/20" />
      )}
      {children}
    </motion.div>
  );
}
