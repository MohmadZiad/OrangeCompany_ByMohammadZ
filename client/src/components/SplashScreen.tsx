"use client";

import React, { useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type SplashScreenProps = {
  /** Controls visibility */
  visible: boolean;
  /** Big letter or logo element shown in the tile */
  logo?: React.ReactNode;
  /** Subtitle/brand line under the tile */
  subtitle?: string;
  /** Called after exit animation completes or user skips */
  onFinish?: () => void;
  /** Auto hide after N ms (runs on mount while visible) */
  autoHideAfter?: number;
  /** 0..100 to show a progress bar; omit to hide */
  progress?: number;
  /** Optional tips that rotate while loading */
  tips?: string[];
  /** Allow user to skip via button / ESC */
  allowSkip?: boolean;
  /** Customize accent color (Tailwind color or hex) */
  accent?: string; // e.g. "#FF7A00" or "orange-500"
  /** Extra class on the outer overlay */
  className?: string;
};

/**
 * Production‑ready Splash Screen
 * - Accessible (role="status", aria-busy, ESC to skip)
 * - Respects prefers‑reduced‑motion
 * - Optional auto-hide & onFinish callback
 * - Optional progress bar & rotating tips
 * - Theming through the `accent` prop (uses CSS vars)
 */
export default function SplashScreen({
  visible,
  logo = (
    <span className="text-5xl font-black tracking-tight text-white drop-shadow-[0_0_14px_rgba(255,180,120,0.7)]">
      O
    </span>
  ),
  subtitle = "Orange Tool",
  onFinish,
  autoHideAfter,
  progress,
  tips,
  allowSkip = true,
  accent = "#FF7A00",
  className,
}: SplashScreenProps) {
  const prefersReducedMotion = useReducedMotion();

  // Auto hide timer
  useEffect(() => {
    if (!visible || !autoHideAfter) return;
    const id = setTimeout(() => {
      onFinish?.();
    }, autoHideAfter);
    return () => clearTimeout(id);
  }, [visible, autoHideAfter, onFinish]);

  // ESC to skip
  useEffect(() => {
    if (!visible || !allowSkip) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFinish?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, allowSkip, onFinish]);

  const tip = useMemo(() => {
    if (!tips?.length) return null;
    const i = Math.floor((Date.now() / 3000) % tips.length);
    return tips[i];
  }, [tips, visible]);

  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as const;

  const tileVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0.9 },
        animate: { opacity: 1 },
        exit: { opacity: 0.9 },
      }
    : {
        initial: { scale: 0.7, opacity: 0 },
        animate: {
          scale: [0.7, 1.04, 1],
          opacity: 1,
          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
        },
        exit: { scale: 0.96, opacity: 0, transition: { duration: 0.4 } },
      };

  const ringVariants = prefersReducedMotion
    ? { animate: { opacity: 0.35 } }
    : {
        animate: { scale: [1, 1.06, 1], opacity: [0.5, 0.9, 0.5] },
        transition: { duration: 2.2, repeat: Infinity },
      };

  // Accent color via CSS var so gradients & shadows can reference it
  const accentStyle: React.CSSProperties = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    "--accent": accent,
  } as React.CSSProperties;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          role="status"
          aria-busy={true}
          aria-live="polite"
          className={[
            "fixed inset-0 z-[80] flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,249,242,0.96),_rgba(255,215,188,0.78))] backdrop-blur-2xl",
            "dark:bg-[rgba(15,10,6,0.9)]",
            className ?? "",
          ].join(" ")}
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35 }}
          style={accentStyle}
        >
          <motion.div
            className="relative flex h-[11.5rem] w-[11.5rem] items-center justify-center rounded-[2.6rem]"
            variants={tileVariants}
          >
            {/* Gradient tile */}
            <div className="absolute inset-0 rounded-[2.6rem] bg-[radial-gradient(130%_130%_at_12%_12%,_rgba(255,170,110,0.95),_rgba(255,120,40,0.85)_45%,_rgba(255,84,15,0.78)_78%)] shadow-[0_38px_95px_-32px_rgba(255,110,20,0.75)] ring-1 ring-white/20 dark:ring-black/30" />

            {/* Glow pulse */}
            <motion.div
              className="absolute inset-[-10px] rounded-[3rem] blur-3xl opacity-70"
              style={{
                background:
                  "radial-gradient(70% 70% at 50% 50%, rgba(255,160,90,0.9), transparent)",
              }}
              {...ringVariants}
            />

            {/* Logo */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { y: 18, opacity: 0, filter: "blur(6px)" }
              }
              animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                transition: {
                  delay: 0.18,
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="relative z-10 select-none"
            >
              {logo}
            </motion.div>

            {/* Wordmark */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 26, scale: 0.95 }
              }
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                textShadow:
                  "0 0 20px rgba(255,180,120,0.55), 0 0 60px rgba(255,120,0,0.5)",
                transition: {
                  delay: 0.32,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              className="absolute inset-x-0 top-[74%] flex items-center justify-center"
            >
              <span className="rounded-full border border-white/20 bg-white/20 px-4 py-1 text-sm font-semibold tracking-[0.4em] uppercase text-white/90 shadow-[0_14px_40px_-26px_rgba(255,90,0,0.65)] backdrop-blur">
                ORANGE TOOL
              </span>
            </motion.div>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.28, duration: 0.4 },
            }}
            className="absolute mt-36 text-center"
          >
            <div className="text-base font-semibold tracking-tight text-[color:var(--accent)] drop-shadow-[0_1px_0_rgba(255,255,255,0.25)] dark:drop-shadow-none">
              {subtitle}
            </div>

            {/* Progress bar */}
            {typeof progress === "number" && (
              <div className="mt-4 h-2 w-72 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <motion.div
                  className="h-full bg-[color:var(--accent)]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.max(0, Math.min(100, progress))}%`,
                  }}
                  transition={{ type: "tween", duration: 0.25 }}
                />
              </div>
            )}

            {/* Tip line */}
            {tip && (
              <div className="mt-3 text-xs text-black/60 dark:text-white/60">
                {tip}
              </div>
            )}
          </motion.div>

          {/* Skip button (visually subtle) */}
          {allowSkip && (
            <button
              type="button"
              onClick={() => onFinish?.()}
              className="absolute bottom-6 right-6 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-xs font-medium text-black/70 backdrop-blur-md transition hover:bg-white hover:text-black dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20"
              aria-label="Skip splash screen"
            >
              تخطي
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
