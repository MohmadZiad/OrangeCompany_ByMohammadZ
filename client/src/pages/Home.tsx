import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Sparkles,
  Zap,
  BookOpen,
  Compass,
  Infinity,
} from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { AssistantHint } from "@/components/AssistantHint";

function CalculatorSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-24 rounded-3xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[420px] rounded-3xl" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProRataSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 rounded-3xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-3xl" />
        ))}
      </div>
      <Skeleton className="h-48 rounded-3xl" />
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-40 rounded-full" />
      <Skeleton className="h-[360px] rounded-3xl" />
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF7A00] via-[#FF5400] to-[#FF3C00] opacity-80 shadow-[0_20px_60px_-28px_rgba(255,90,0,0.6)]">
      <MessageSquare className="h-6 w-6 text-white" />
    </div>
  );
}

const OrangeCalculator = lazy(() =>
  import("@/components/OrangeCalculator").then((mod) => ({
    default: mod.OrangeCalculator,
  }))
);

const ProRataCalculator = lazy(() =>
  import("@/components/ProRataCalculator")
);

const SummaryPanel = lazy(() =>
  import("@/components/SummaryPanel").then((mod) => ({
    default: mod.SummaryPanel,
  }))
);

const SummaryPanelMobile = lazy(() =>
  import("@/components/SummaryPanel").then((mod) => ({
    default: mod.SummaryPanelMobile,
  }))
);

const Chatbot = lazy(() =>
  import("@/components/Chatbot").then((mod) => ({ default: mod.Chatbot }))
);

export default function Home() {
  const { theme, locale, activeTab, setActiveTab, setChatOpen } = useAppStore();
  const [docsStatus, setDocsStatus] = useState({
    total: 0,
    loading: true,
    error: false,
  });

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "orange", "blossom", "mint");
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.add(theme);
    }
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";
  }, [theme, locale]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && ["calculator", "pro-rata", "assistant"].includes(hash)) {
      setActiveTab(hash);
      if (hash === "assistant") {
        setChatOpen(true);
      }
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      if (newHash && ["calculator", "pro-rata", "assistant"].includes(newHash)) {
        setActiveTab(newHash);
        if (newHash === "assistant") {
          setChatOpen(true);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [setActiveTab, setChatOpen]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
    if (value === "assistant") {
      setChatOpen(true);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const response = await fetch("/api/docs", { cache: "no-store" });
        if (!response.ok) throw new Error("docs");
        const data = await response.json();
        if (!isMounted) return;
        const total = Array.isArray(data?.docs) ? data.docs.length : 0;
        setDocsStatus({ total, loading: false, error: false });
      } catch {
        if (!isMounted) return;
        setDocsStatus((prev) => ({ ...prev, loading: false, error: true }));
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const docsGoal = 24;
  const docProgress = useMemo(
    () => Math.min(100, Math.round((docsStatus.total / docsGoal) * 100)),
    [docsStatus.total]
  );

  const docStatusLabel = docsStatus.loading
    ? locale === "ar"
      ? "يتم تحميل الوثائق"
      : "Loading docs"
    : docsStatus.error
    ? locale === "ar"
      ? "تعذر تحميل الوثائق"
      : "Docs unavailable"
    : locale === "ar"
    ? `تم تجهيز ${docsStatus.total} وثيقة`
    : `${docsStatus.total} docs ready`;

  const docBadgeLabel = docsStatus.loading
    ? locale === "ar"
      ? "تحميل"
      : "Loading"
    : docsStatus.error
    ? locale === "ar"
      ? "خطأ"
      : "Error"
    : `${docProgress}%`;

  const heroTitle =
    locale === "ar"
      ? "كل أدوات أورنج في لوحة واحدة"
      : "Your Orange cockpit, reimagined";
  const heroSubtitle =
    locale === "ar"
      ? "حوّل الأسعار، البروراتا، والمحادثات الذكية إلى قرارات فورية."
      : "Turn pricing, pro-rata math, and AI assistance into confident decisions.";

  const heroStats = useMemo(
    () => [
      {
        label: locale === "ar" ? "جاهزية" : "Readiness",
        value: docsStatus.loading ? "--" : `${docProgress}%`,
        caption: locale === "ar" ? "وثائق مهيأة" : "Docs primed",
      },
      {
        label: locale === "ar" ? "زمن الاستجابة" : "Response",
        value: "0.8s",
        caption: locale === "ar" ? "تنفيذ سريع" : "Average compute",
      },
      {
        label: locale === "ar" ? "التركيز" : "Focus",
        value: "24/7",
        caption: locale === "ar" ? "مراقبة مستمرة" : "Always on",
      },
    ],
    [docProgress, docsStatus.loading, locale]
  );

  const featureCards = useMemo(
    () => [
      {
        icon: <Sparkles className="h-5 w-5" />,
        title: locale === "ar" ? "نتائج لحظية" : "Instant outcomes",
        description:
          locale === "ar"
            ? "الواجهات التفاعلية تعرض النتائج قبل أن تنتهي من الكتابة."
            : "Dynamic panels surface answers faster than you can finish typing.",
      },
      {
        icon: <Zap className="h-5 w-5" />,
        title: locale === "ar" ? "بروراتا بذكاء" : "Smart pro-rata",
        description:
          locale === "ar"
            ? "محركات الحسبات تُوازن بين المدة والقيمة برسوم متحركة توضح التدفق."
            : "Animated billing flows keep every percentage and period in perfect sync.",
      },
      {
        icon: <BookOpen className="h-5 w-5" />,
        title: locale === "ar" ? "مكتبة حيّة" : "Live doc library",
        description:
          locale === "ar"
            ? "المستندات يتم بثها مباشرة مع تلميحات مساعدة وارتباطات سريعة."
            : "Docs stream in live with contextual hints and quick actions at hand.",
      },
    ],
    [locale]
  );

  const cockpitTiles = useMemo(
    () => [
      {
        title: locale === "ar" ? "التحكّم" : "Command center",
        body:
          locale === "ar"
            ? "بدّل بين الأدوات واللغات وأنماط العرض في لحظة واحدة."
            : "Swap tools, locales, and modes without breaking your flow.",
        icon: <Compass className="h-5 w-5" />,
      },
      {
        title: locale === "ar" ? "الاستمرارية" : "Continuity",
        body:
          locale === "ar"
            ? "جلسات المساعد تحفظ السجلات وتجلب الوثائق فوراً."
            : "Assistant sessions persist context and retrieve docs on demand.",
        icon: <Infinity className="h-5 w-5" />,
      },
    ],
    [locale]
  );

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const springX = useSpring(pointerX, { stiffness: 70, damping: 18, mass: 0.8 });
  const springY = useSpring(pointerY, { stiffness: 70, damping: 18, mass: 0.8 });
  const glowX = useTransform(springX, (value) => `${value * 100}%`);
  const glowY = useTransform(springY, (value) => `${value * 100}%`);
  const glowGradient = useMotionTemplate`radial-gradient(125% 125% at ${glowX} ${glowY}, rgba(255,136,52,0.32), transparent 68%)`;
  const accentOrbitX = useTransform(springX, (value) => (value - 0.5) * 36);
  const accentOrbitY = useTransform(springY, (value) => (value - 0.5) * 28);
  const secondaryOrbitX = useTransform(springX, (value) => (value - 0.5) * -28);
  const secondaryOrbitY = useTransform(springY, (value) => (value - 0.5) * 22);
  const cockpitHeight = "min(780px, calc(100vh - 220px))";

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth);
      pointerY.set(event.clientY / window.innerHeight);
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [pointerX, pointerY]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#FFF6ED] text-[#2c1606] transition-colors duration-300 dark:bg-[#0f0704] dark:text-white">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: glowGradient }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 z-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#FF6A00]/45 via-[#FF8A33]/40 to-transparent blur-3xl dark:from-[#FF9448]/30"
        style={{ x: accentOrbitX, y: accentOrbitY }}
        animate={{ opacity: [0.5, 0.95, 0.5], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[-160px] right-[-120px] z-0 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-[#FFDDC2]/50 via-[#FFEAD8]/30 to-transparent blur-3xl dark:from-[#2e160a]/70 dark:via-[#1f0d07]/60"
        style={{ x: secondaryOrbitX, y: secondaryOrbitY }}
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.92, 1.05, 0.92] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />

      <header className="relative z-30 px-4 pt-6 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/60 bg-white/60 px-5 py-4 shadow-[0_30px_90px_-60px_rgba(255,128,40,0.75)] backdrop-blur-3xl transition dark:border-white/10 dark:bg-[#1a0f0a]/75">
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="flex items-center gap-4"
          >
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6A00] via-[#FF8A33] to-[#FFA94D] text-xl font-bold text-white shadow-[0_26px_64px_-34px_rgba(255,128,40,0.85)]">
              <span className="drop-shadow-[0_3px_12px_rgba(255,158,92,0.7)]">O</span>
            </div>
            <div className="space-y-1">
              <motion.h1
                className="text-xl font-semibold tracking-tight sm:text-2xl"
                data-testid="text-app-title"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              >
                {t("appTitle", locale)}
              </motion.h1>
              <motion.p
                className="text-xs text-black/60 dark:text-white/60 sm:text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              >
                {locale === "ar"
                  ? "منصة عالمية لحسابات دقيقة ومحادثات أنيقة."
                  : "A global cockpit for precise pricing and elegant conversations."}
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="flex items-center gap-2"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setChatOpen(true);
                setActiveTab("assistant");
                window.location.hash = "assistant";
              }}
              className="hidden rounded-full border border-white/40 bg-white/40 px-4 text-xs font-semibold text-[#7a3b10] shadow-[0_20px_55px_-40px_rgba(255,140,60,0.6)] backdrop-blur hover:-translate-y-0.5 hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/10 dark:text-white/80 sm:flex"
              data-testid="button-help"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {t("help", locale)}
            </Button>
            <ThemeToggle />
            <LanguageToggle />
          </motion.div>
        </div>
      </header>

      <main className="relative z-20 flex flex-1 items-center px-4 pb-10 pt-6 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div
            className="grid gap-8 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]"
            style={{ minHeight: cockpitHeight }}
          >
            <motion.section
              data-reveal
              className="relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-white/60 bg-white/70 px-8 py-10 shadow-[0_70px_160px_-90px_rgba(255,120,40,0.85)] backdrop-blur-3xl transition dark:border-white/10 dark:bg-[#1b100a]/80"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="absolute -right-24 top-10 h-64 w-64 rounded-full bg-gradient-to-br from-[#FFB37A]/45 via-[#FFE0C1]/35 to-transparent blur-3xl" aria-hidden />
              <div className="absolute -left-20 bottom-6 h-60 w-60 rounded-full bg-gradient-to-br from-[#FF6A00]/35 via-transparent to-transparent blur-3xl" aria-hidden />

              <div className="relative z-10 flex flex-col gap-8">
                <div className="space-y-6">
                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-white/50 bg-white/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#cf5a00] shadow-[0_18px_46px_-32px_rgba(255,140,60,0.65)] backdrop-blur"
                  >
                    {locale === "ar" ? "التجربة الفاخرة" : "Signature experience"}
                  </motion.span>
                  <motion.h2
                    className="text-4xl font-semibold leading-tight drop-shadow-[0_12px_45px_rgba(255,210,180,0.55)] sm:text-[2.85rem]"
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {heroTitle}
                  </motion.h2>
                  <motion.p
                    className="max-w-xl text-sm text-black/65 dark:text-white/70 sm:text-base"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                  >
                    {heroSubtitle}
                  </motion.p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF8A33] to-[#FFA94D] px-6 text-sm font-semibold text-white shadow-[0_40px_90px_-55px_rgba(255,130,40,0.95)] transition hover:scale-[1.02] hover:shadow-[0_48px_120px_-60px_rgba(255,150,70,0.9)]"
                    onClick={() => {
                      setActiveTab("assistant");
                      setChatOpen(true);
                      window.location.hash = "assistant";
                    }}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    {locale === "ar" ? "افتح المساعد" : "Open assistant"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full border border-white/60 bg-white/70 px-6 text-sm font-semibold text-[#c25200] shadow-[0_28px_78px_-52px_rgba(255,140,60,0.65)] backdrop-blur hover:-translate-y-0.5 hover:bg-white/90 dark:border-white/15 dark:bg-white/10 dark:text-white"
                    onClick={() => {
                      setActiveTab("calculator");
                      window.location.hash = "calculator";
                    }}
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    {locale === "ar" ? "إطلاق الحاسبة" : "Launch calculator"}
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {heroStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.32 + index * 0.06, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                      className="rounded-3xl border border-white/60 bg-white/65 p-4 text-[#4a2a14] shadow-[0_30px_84px_-60px_rgba(255,138,50,0.8)] backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white"
                    >
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#d65a00] dark:text-[#FFB267]">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
                      <p className="mt-1 text-xs text-black/55 dark:text-white/55">{stat.caption}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {featureCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 320, damping: 24 }}
                      className={`group relative overflow-hidden rounded-[28px] border border-white/55 bg-white/70 p-5 shadow-[0_36px_88px_-64px_rgba(255,130,45,0.75)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10 ${index === 2 ? "md:col-span-2" : ""}`}
                    >
                      <motion.div
                        className="absolute inset-0 z-0 bg-gradient-to-br from-[#FF6A00]/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
                        initial={false}
                      />
                      <div className="relative z-10 flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6A00] via-[#FF8A33] to-[#FFA94D] text-white shadow-[0_24px_60px_-40px_rgba(255,150,70,0.85)]">
                          {card.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">{card.title}</h4>
                          <p className="mt-2 text-sm text-black/60 dark:text-white/65">{card.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-[0_44px_120px_-70px_rgba(255,136,50,0.7)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6A00] via-[#FF8A33] to-[#FFA94D] text-white shadow-[0_26px_66px_-42px_rgba(255,140,60,0.75)]">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">
                          {locale === "ar" ? "مكتبة المستندات" : "Doc library"}
                        </h3>
                        <p className="text-xs text-black/55 dark:text-white/55">{docStatusLabel}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full border-white/50 bg-white/80 px-3 py-1 text-[11px] font-semibold text-[#d65a00] backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-white"
                    >
                      {docBadgeLabel}
                    </Badge>
                  </div>
                  <div className="mt-5 space-y-4">
                    <Progress
                      value={docsStatus.loading || docsStatus.error ? 0 : docProgress}
                      className="h-2.5 overflow-hidden rounded-full bg-white/50 dark:bg-white/10"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      {cockpitTiles.map((tile) => (
                        <motion.div
                          key={tile.title}
                          whileHover={{ y: -4 }}
                          className="rounded-2xl border border-white/55 bg-white/70 p-4 shadow-[0_28px_78px_-58px_rgba(255,130,45,0.7)] backdrop-blur dark:border-white/10 dark:bg-white/10"
                        >
                          <div className="flex items-center gap-2 text-[#d65a00] dark:text-[#FFB267]">
                            {tile.icon}
                            <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">
                              {tile.title}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-black/60 dark:text-white/65">{tile.body}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        className="rounded-full border border-white/55 bg-white/80 px-4 py-2 text-xs font-semibold text-[#d65a00] shadow-[0_24px_62px_-46px_rgba(255,140,60,0.65)] transition hover:bg-white hover:shadow-[0_26px_76px_-54px_rgba(255,160,80,0.75)] dark:border-white/15 dark:bg-white/10 dark:text-white"
                        onClick={() => {
                          setActiveTab("assistant");
                          setChatOpen(true);
                          window.location.hash = "assistant";
                        }}
                      >
                        {locale === "ar" ? "اطلب وثيقة" : "Request a doc"}
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full border border-white/45 px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-white/70 dark:border-white/20 dark:hover:bg-white/10"
                        onClick={() => {
                          window.open("/api/docs", "_blank", "noopener,noreferrer");
                        }}
                      >
                        {locale === "ar" ? "عرض JSON" : "View raw JSON"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            <motion.section
              data-reveal
              className="relative flex flex-col gap-6 overflow-hidden rounded-[36px] border border-white/55 bg-white/65 p-6 shadow-[0_70px_160px_-90px_rgba(255,125,40,0.8)] backdrop-blur-3xl transition dark:border-white/10 dark:bg-[#180d08]/85"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="flex h-full flex-col gap-6 xl:flex-row xl:items-stretch">
                <div className="flex h-full flex-1 flex-col overflow-hidden rounded-[28px] border border-white/55 bg-white/75 p-5 shadow-[0_46px_120px_-88px_rgba(255,130,45,0.75)] backdrop-blur-3xl dark:border-white/10 dark:bg-white/10">
                  <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="flex h-full flex-col"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full border border-white/50 bg-white/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#c45a00] backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-white/70">
                        {locale === "ar" ? "سطح التحكم" : "Control deck"}
                      </span>
                      <Badge className="rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF8A33] to-[#FFA94D] px-3 py-1 text-[10px] font-semibold text-white shadow-[0_20px_50px_-38px_rgba(255,140,60,0.75)]">
                        {locale === "ar" ? "تفاعلي" : "Interactive"}
                      </Badge>
                    </div>
                    <TabsList className="relative mt-4 grid grid-cols-3 gap-2 rounded-full border border-white/50 bg-white/50 p-1 text-xs font-medium text-[#7e4315] backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-white/60">
                      {[
                        { value: "calculator", label: t("calculator", locale), testId: "tab-calculator" },
                        { value: "pro-rata", label: t("proRata", locale), testId: "tab-pro-rata" },
                        { value: "assistant", label: t("assistant", locale), testId: "tab-assistant" },
                      ].map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          data-testid={tab.testId}
                          className="group relative overflow-hidden rounded-full px-4 py-2 transition focus-visible:ring-2 focus-visible:ring-offset-2 data-[state=active]:text-white"
                        >
                          {activeTab === tab.value && (
                            <motion.span
                              layoutId="active-pill"
                              className="absolute inset-0 z-0 rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF8A33] to-[#FFA94D] shadow-[0_20px_60px_-36px_rgba(255,130,45,0.85)]"
                              transition={{ type: "spring", stiffness: 420, damping: 40 }}
                            />
                          )}
                          <span className="relative z-10 whitespace-nowrap text-sm font-semibold">
                            {tab.label}
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <div className="relative mt-6 flex flex-1 overflow-hidden rounded-[26px] border border-white/50 bg-white/65 p-2 shadow-[0_40px_120px_-80px_rgba(255,130,45,0.7)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
                      <TabsContent value="calculator" className="flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-white/80 p-2 data-[state=inactive]:hidden dark:bg-white/5">
                        <motion.div
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                          className="flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-white/60 bg-white/80 p-4 backdrop-blur-lg dark:border-white/10 dark:bg-white/5"
                        >
                          <div className="h-full w-full overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,154,82,0.6)_transparent]">
                            <Suspense fallback={<CalculatorSkeleton />}>
                              <OrangeCalculator />
                            </Suspense>
                          </div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="pro-rata" className="flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-white/80 p-2 data-[state=inactive]:hidden dark:bg-white/5">
                        <motion.div
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                          className="flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-white/60 bg-white/80 p-4 backdrop-blur-lg dark:border-white/10 dark:bg-white/5"
                        >
                          <div className="h-full w-full overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,154,82,0.6)_transparent]">
                            <Suspense fallback={<ProRataSkeleton />}>
                              <ProRataCalculator />
                            </Suspense>
                          </div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="assistant" className="flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-white/80 p-6 text-center data-[state=inactive]:hidden dark:bg-white/5">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
                          className="flex h-full flex-col items-center justify-center gap-4 rounded-[20px] border border-white/55 bg-gradient-to-br from-white/90 via-white/70 to-white/40 p-8 text-center shadow-[0_36px_110px_-80px_rgba(255,140,60,0.7)] backdrop-blur-2xl dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/5"
                        >
                          <MessageSquare className="h-14 w-14 text-[#FF7A1A] drop-shadow-[0_18px_55px_rgba(255,150,70,0.65)]" />
                          <h3 className="text-2xl font-semibold">
                            {t("chatTitle", locale)}
                          </h3>
                          <p className="max-w-md text-sm text-black/60 dark:text-white/65">
                            {t("chatPlaceholder", locale)}
                          </p>
                          <Button
                            onClick={() => setChatOpen(true)}
                            size="lg"
                            data-testid="button-open-assistant"
                            className="rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF8A33] to-[#FFA94D] px-6 text-sm font-semibold text-white shadow-[0_38px_100px_-60px_rgba(255,150,70,0.85)] transition hover:scale-[1.02]"
                          >
                            <MessageSquare className="mr-2 h-5 w-5" />
                            {t("help", locale)}
                          </Button>
                        </motion.div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>

                <div className="hidden h-full w-full max-w-sm flex-none flex-col overflow-hidden rounded-[28px] border border-white/55 bg-white/75 p-5 shadow-[0_50px_140px_-90px_rgba(255,136,50,0.8)] backdrop-blur-3xl dark:border-white/10 dark:bg-white/10 xl:flex">
                  <Suspense fallback={<SummarySkeleton />}>
                    <SummaryPanel />
                  </Suspense>
                </div>
              </div>

              <div className="xl:hidden">
                <Suspense fallback={<SummarySkeleton />}>
                  <SummaryPanelMobile />
                </Suspense>
              </div>
            </motion.section>
          </div>

          <motion.footer
            data-reveal
            className="flex items-center justify-between rounded-full border border-white/55 bg-white/60 px-6 py-4 text-xs text-black/60 shadow-[0_32px_110px_-80px_rgba(255,140,60,0.7)] backdrop-blur-2xl transition dark:border-white/10 dark:bg-white/10 dark:text-white/60"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="font-medium text-[#a24a00] dark:text-white/70">© {currentYear} Orange Tool</span>
            <span>{locale === "ar" ? "تصميم برتقالي عالمي" : "World-class orange identity"}</span>
          </motion.footer>
        </div>
      </main>

      <Suspense fallback={<ChatSkeleton />}>
        <Chatbot />
      </Suspense>
      <AssistantHint />
    </div>
  );
}
