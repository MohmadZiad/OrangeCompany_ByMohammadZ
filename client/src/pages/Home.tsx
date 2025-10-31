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
  Waves,
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
    <div className="space-y-6">
      <Skeleton className="h-24 rounded-3xl" />
      <Skeleton className="h-[420px] rounded-3xl" />
    </div>
  );
}

function ProRataSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 rounded-3xl" />
      <Skeleton className="h-[360px] rounded-3xl" />
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32 rounded-full" />
      <Skeleton className="h-[320px] rounded-3xl" />
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A3D] via-[#FF6F0F] to-[#FF4600] opacity-80 shadow-[0_20px_60px_-24px_rgba(255,110,20,0.65)]">
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

  const localeIsArabic = locale === "ar";

  const docsGoal = 24;
  const docProgress = useMemo(
    () => Math.min(100, Math.round((docsStatus.total / docsGoal) * 100)),
    [docsStatus.total]
  );

  const docStatusLabel = docsStatus.loading
    ? localeIsArabic
      ? "يتم تحميل الوثائق"
      : "Loading docs"
    : docsStatus.error
    ? localeIsArabic
      ? "تعذر تحميل الوثائق"
      : "Docs unavailable"
    : localeIsArabic
    ? `تم تجهيز ${docsStatus.total} وثيقة`
    : `${docsStatus.total} docs ready`;

  const docBadgeLabel = docsStatus.loading
    ? localeIsArabic
      ? "تحميل"
      : "Loading"
    : docsStatus.error
    ? localeIsArabic
      ? "خطأ"
      : "Error"
    : `${docProgress}%`;

  const heroTitle = localeIsArabic
    ? "كل أدوات أورنج في لوحة واحدة"
    : "All of Orange, perfectly orchestrated";
  const heroSubtitle = localeIsArabic
    ? "حوّل الحسابات، البروراتا، والمحادثة الذكية إلى لوحة واحدة مترفة."
    : "Turn pricing, pro-rata flows, and AI dialogue into one luxurious control room.";

  const heroStats = useMemo(
    () => [
      {
        label: localeIsArabic ? "جاهزية" : "Readiness",
        value: docsStatus.loading ? "--" : `${docProgress}%`,
        caption: localeIsArabic ? "وثائق في الخدمة" : "Docs on standby",
      },
      {
        label: localeIsArabic ? "استجابة" : "Response",
        value: "0.8s",
        caption: localeIsArabic ? "تنفيذ لحظي" : "Instant compute",
      },
      {
        label: localeIsArabic ? "مراقبة" : "Presence",
        value: "24/7",
        caption: localeIsArabic ? "جاهزية كاملة" : "Always awake",
      },
    ],
    [docProgress, docsStatus.loading, localeIsArabic]
  );

  const featureCards = useMemo(
    () => [
      {
        icon: <Sparkles className="h-5 w-5" />,
        title: localeIsArabic ? "نتائج لحظية" : "Instant outcomes",
        description: localeIsArabic
          ? "تعرف على الإجابات مباشرة في الواجهة دون الخروج من اللوحة."
          : "Surface decisive answers right inside the cockpit without context switching.",
      },
      {
        icon: <Zap className="h-5 w-5" />,
        title: localeIsArabic ? "بروراتا بذكاء" : "Smart pro-rata",
        description: localeIsArabic
          ? "محرك مرئي يوضح نسب البروراتا بخطوات تفاعلية مذهلة."
          : "A visual engine that explains every percentage with cinematic transitions.",
      },
      {
        icon: <BookOpen className="h-5 w-5" />,
        title: localeIsArabic ? "مكتبة حيّة" : "Live doc library",
        description: localeIsArabic
          ? "وثائق متجددة مع تلميحات مساعد وعمليات فورية."
          : "A living library that streams documents with assistant-ready actions.",
      },
    ],
    [localeIsArabic]
  );

  const cockpitHighlights = useMemo(
    () => [
      {
        icon: <Compass className="h-5 w-5" />,
        title: localeIsArabic ? "تحكم كامل" : "Total control",
        body: localeIsArabic
          ? "بدّل بين الأدوات، اللغات، والثيمات بلمسة واحدة."
          : "Flip between tools, locales, and themes with a single gesture.",
      },
      {
        icon: <Infinity className="h-5 w-5" />,
        title: localeIsArabic ? "سياق مستمر" : "Endless context",
        body: localeIsArabic
          ? "الجلسات تحفظ كل تفاصيلك وتعود لعرضها عند الطلب."
          : "Sessions remember every detail and bring it back instantly.",
      },
      {
        icon: <Waves className="h-5 w-5" />,
        title: localeIsArabic ? "حركة سلسة" : "Fluid motion",
        body: localeIsArabic
          ? "انتقالات محسوبة تعطي إحساس منتج عالمي وفاخر."
          : "Considered motion brings a global, premium aura to every action.",
      },
    ],
    [localeIsArabic]
  );

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const springX = useSpring(pointerX, { stiffness: 70, damping: 18, mass: 0.8 });
  const springY = useSpring(pointerY, { stiffness: 70, damping: 18, mass: 0.8 });
  const glowX = useTransform(springX, (value) => `${value * 100}%`);
  const glowY = useTransform(springY, (value) => `${value * 100}%`);
  const glowGradient = useMotionTemplate`radial-gradient(140% 140% at ${glowX} ${glowY}, rgba(255,175,110,0.38), rgba(255,247,235,0.92) 48%, transparent 72%)`;
  const accentOrbitX = useTransform(springX, (value) => (value - 0.5) * 40);
  const accentOrbitY = useTransform(springY, (value) => (value - 0.5) * 26);
  const secondaryOrbitX = useTransform(springX, (value) => (value - 0.5) * -32);
  const secondaryOrbitY = useTransform(springY, (value) => (value - 0.5) * 24);

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
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#FFF7EF] text-[#2b1408] transition-colors duration-500 dark:bg-[#100804] dark:text-[#FDEFE2]">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: glowGradient }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 z-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-[conic-gradient(from_140deg,_rgba(255,170,90,0.8),_rgba(255,110,20,0.4),_transparent_70%)] blur-[120px] dark:opacity-70"
        style={{ x: accentOrbitX, y: accentOrbitY }}
        animate={{ opacity: [0.35, 0.8, 0.35], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[-180px] right-[-120px] z-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,_rgba(255,204,170,0.7),_transparent_70%)] blur-[120px] dark:from-[#2a1308] dark:via-[#180a05] dark:to-transparent"
        style={{ x: secondaryOrbitX, y: secondaryOrbitY }}
        animate={{ opacity: [0.4, 0.75, 0.4], scale: [0.92, 1.06, 0.92] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
      />

      <header className="relative z-30 flex shrink-0 items-center justify-between px-4 pt-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="flex items-center gap-4 rounded-full border border-white/60 bg-white/70 px-4 py-3 shadow-[0_30px_90px_-60px_rgba(255,140,50,0.8)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/10"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8A3D] via-[#FF7420] to-[#FF5405] text-lg font-bold text-white shadow-[0_24px_60px_-32px_rgba(255,110,20,0.9)]">
            <span className="drop-shadow-[0_4px_18px_rgba(255,180,120,0.65)]">O</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl" data-testid="text-app-title">
              {t("appTitle", locale)}
            </h1>
            <p className="text-xs text-black/60 dark:text-white/60 sm:text-sm">
              {localeIsArabic
                ? "منتج عالمي بإحساس فاخر ولغة تتبدّل فوراً."
                : "A global-grade cockpit with instant locale and theme control."}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
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
            className="hidden rounded-full border border-white/40 bg-white/50 px-4 text-xs font-semibold text-[#a64a00] shadow-[0_20px_55px_-36px_rgba(255,138,60,0.6)] backdrop-blur hover:-translate-y-0.5 hover:bg-white/80 focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-white/10 dark:text-white/70 sm:flex"
            data-testid="button-help"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {t("help", locale)}
          </Button>
          <ThemeToggle />
          <LanguageToggle />
        </motion.div>
      </header>

      <main className="relative z-20 flex flex-1 px-4 pb-4 pt-4 sm:px-8 sm:pb-6">
        <div className="mx-auto flex w-full max-w-[1320px] flex-1 gap-4 lg:gap-6 xl:gap-8">
          <motion.section
            className="relative hidden min-h-0 flex-[0.85] flex-col overflow-hidden rounded-[36px] border border-white/70 bg-white/65 px-7 py-8 shadow-[0_70px_160px_-90px_rgba(255,134,58,0.85)] backdrop-blur-2xl transition dark:border-white/10 dark:bg-white/5 dark:text-white lg:flex"
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 via-transparent to-transparent dark:from-white/10" aria-hidden />
            <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(255,200,150,0.55),_transparent_70%)] blur-3xl" aria-hidden />
            <div className="absolute -right-24 bottom-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(255,156,90,0.5),_transparent_72%)] blur-3xl dark:opacity-80" aria-hidden />

            <div className="relative flex h-full min-h-0 flex-col gap-6">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#d45a00] shadow-[0_24px_70px_-50px_rgba(255,138,55,0.65)] backdrop-blur"
              >
                {localeIsArabic ? "هوية جديدة" : "New orange identity"}
              </motion.span>

              <div className="space-y-5">
                <motion.h2
                  className="max-w-xl text-4xl font-semibold leading-tight drop-shadow-[0_18px_55px_rgba(255,200,150,0.6)] xl:text-[2.9rem]"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {heroTitle}
                </motion.h2>
                <motion.p
                  className="max-w-xl text-sm text-black/65 dark:text-white/65 sm:text-base"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                >
                  {heroSubtitle}
                </motion.p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-[#FF8D3F] via-[#FF7420] to-[#FF5B07] px-6 text-sm font-semibold text-white shadow-[0_40px_110px_-60px_rgba(255,110,20,0.95)] transition hover:scale-[1.02] hover:shadow-[0_48px_130px_-64px_rgba(255,110,20,0.85)]"
                  onClick={() => {
                    setActiveTab("assistant");
                    setChatOpen(true);
                    window.location.hash = "assistant";
                  }}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {localeIsArabic ? "افتح المساعد" : "Open assistant"}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full border border-white/60 bg-white/80 px-6 text-sm font-semibold text-[#c24f00] shadow-[0_34px_100px_-70px_rgba(255,150,70,0.7)] backdrop-blur hover:-translate-y-0.5 hover:bg-white/95 dark:border-white/15 dark:bg-white/10 dark:text-white"
                  onClick={() => {
                    setActiveTab("calculator");
                    window.location.hash = "calculator";
                  }}
                >
                  <Zap className="mr-2 h-5 w-5" />
                  {localeIsArabic ? "إطلاق الحاسبة" : "Launch calculator"}
                </Button>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-3">
                {heroStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32 + index * 0.05, duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
                    className="rounded-3xl border border-white/60 bg-white/70 p-4 text-[#4a2a14] shadow-[0_30px_84px_-60px_rgba(255,140,60,0.7)] backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white"
                  >
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#e16910] dark:text-[#FFB26A]">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
                    <p className="mt-1 text-xs text-black/55 dark:text-white/55">{stat.caption}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="grid h-full min-h-0 gap-3 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,150,90,0.6)_transparent]">
                  {featureCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 320, damping: 24 }}
                      className="group relative overflow-hidden rounded-[28px] border border-white/55 bg-white/70 p-5 shadow-[0_36px_88px_-64px_rgba(255,130,45,0.75)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10"
                    >
                      <motion.div
                        className="absolute inset-0 z-0 bg-gradient-to-br from-[#FF8A3D]/14 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
                        initial={false}
                      />
                      <div className="relative z-10 flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8D3F] via-[#FF7120] to-[#FF5B07] text-white shadow-[0_24px_60px_-40px_rgba(255,140,60,0.85)]">
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
              </div>

              <div className="mt-1 flex shrink-0 flex-wrap items-center justify-between gap-3 text-[11px] text-black/55 dark:text-white/55">
                <span>{localeIsArabic ? "هوية برتقالية عالمية" : "Global orange design system"}</span>
                <span>{localeIsArabic ? "تجربة بلا تمرير" : "No-scroll interactive deck"}</span>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[36px] border border-white/60 bg-white/70 p-4 shadow-[0_60px_160px_-100px_rgba(255,128,40,0.8)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex shrink-0 items-center justify-between rounded-[28px] border border-white/50 bg-white/60 px-4 py-3 text-sm text-[#b05000] shadow-[0_26px_80px_-64px_rgba(255,138,55,0.6)] backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white/70">
              <span className="font-semibold">
                {localeIsArabic ? "لوحة التحكم الرئيسية" : "Central command"}
              </span>
              <span className="text-xs text-black/50 dark:text-white/50">
                {localeIsArabic ? "يتفاعل مع كل حركة" : "Responds to every gesture"}
              </span>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="mt-4 flex min-h-0 flex-1 flex-col"
            >
              <TabsList className="relative grid h-12 grid-cols-3 gap-2 rounded-full border border-white/60 bg-white/70 p-1 text-xs text-[#c24f00] shadow-[0_34px_90px_-70px_rgba(255,138,55,0.7)] backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white/70">
                {[
                  {
                    value: "calculator",
                    label: localeIsArabic ? "حاسبة الأسعار" : "Pricing calculator",
                  },
                  {
                    value: "pro-rata",
                    label: localeIsArabic ? "بروراتا" : "Pro-rata studio",
                  },
                  {
                    value: "assistant",
                    label: localeIsArabic ? "المساعد الذكي" : "Intelligent assistant",
                  },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="relative flex items-center justify-center rounded-full px-3 py-2 font-semibold data-[state=active]:text-white"
                  >
                    {activeTab === tab.value && (
                      <motion.span
                        layoutId="active-pill"
                        className="absolute inset-0 z-0 rounded-full bg-gradient-to-r from-[#FF8D3F] via-[#FF7120] to-[#FF5B07] shadow-[0_24px_70px_-48px_rgba(255,118,30,0.8)]"
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                      />
                    )}
                    <span className="relative z-10 whitespace-nowrap">
                      {tab.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="relative mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
                <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-[28px] border border-white/50 bg-white/70 p-2 shadow-[0_40px_120px_-80px_rgba(255,136,58,0.7)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
                  <TabsContent value="calculator" className="flex h-full w-full flex-col overflow-hidden rounded-[24px] bg-white/85 p-3 data-[state=inactive]:hidden dark:bg-white/5">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                      className="flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-white/60 bg-white/80 p-4 backdrop-blur-lg dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="h-full w-full overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,154,82,0.6)_transparent]">
                        <Suspense fallback={<CalculatorSkeleton />}>
                          <OrangeCalculator />
                        </Suspense>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="pro-rata" className="flex h-full w-full flex-col overflow-hidden rounded-[24px] bg-white/85 p-3 data-[state=inactive]:hidden dark:bg-white/5">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                      className="flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-white/60 bg-white/80 p-4 backdrop-blur-lg dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="h-full w-full overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,154,82,0.6)_transparent]">
                        <Suspense fallback={<ProRataSkeleton />}>
                          <ProRataCalculator />
                        </Suspense>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="assistant" className="flex h-full w-full flex-col overflow-hidden rounded-[24px] bg-white/85 p-8 text-center data-[state=inactive]:hidden dark:bg-white/5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
                      className="flex h-full flex-col items-center justify-center gap-4 rounded-[22px] border border-white/55 bg-gradient-to-br from-white/90 via-white/70 to-white/40 text-center shadow-[0_36px_110px_-80px_rgba(255,140,60,0.7)] backdrop-blur-2xl dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/5"
                    >
                      <MessageSquare className="h-14 w-14 text-[#FF7F24] drop-shadow-[0_18px_55px_rgba(255,150,70,0.65)]" />
                      <h3 className="text-2xl font-semibold">{t("chatTitle", locale)}</h3>
                      <p className="max-w-md text-sm text-black/60 dark:text-white/65">{t("chatPlaceholder", locale)}</p>
                      <Button
                        onClick={() => setChatOpen(true)}
                        size="lg"
                        data-testid="button-open-assistant"
                        className="rounded-full bg-gradient-to-r from-[#FF8D3F] via-[#FF7120] to-[#FF5B07] px-6 text-sm font-semibold text-white shadow-[0_38px_110px_-60px_rgba(255,150,70,0.85)] transition hover:scale-[1.02]"
                      >
                        <MessageSquare className="mr-2 h-5 w-5" />
                        {t("help", locale)}
                      </Button>
                    </motion.div>
                  </TabsContent>
                </div>

                <div className="shrink-0 xl:hidden">
                  <Suspense fallback={<SummarySkeleton />}>
                    <SummaryPanelMobile />
                  </Suspense>
                </div>
              </div>
            </Tabs>
          </motion.section>

          <motion.aside
            className="relative hidden min-h-0 w-[320px] flex-col overflow-hidden rounded-[36px] border border-white/60 bg-white/70 p-5 shadow-[0_60px_150px_-90px_rgba(255,134,58,0.75)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 xl:flex"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="rounded-[26px] border border-white/60 bg-white/75 p-5 shadow-[0_32px_90px_-60px_rgba(255,138,55,0.6)] backdrop-blur dark:border-white/10 dark:bg-white/10">
                <div className="flex items-center justify-between gap-3">
                  <Badge className="rounded-full bg-gradient-to-r from-[#FF8D3F] via-[#FF7120] to-[#FF5B07] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_16px_50px_-34px_rgba(255,120,30,0.8)]">
                    {docBadgeLabel}
                  </Badge>
                  <span className="text-xs text-black/60 dark:text-white/60">{docsGoal}</span>
                </div>
                <p className="mt-4 text-sm font-semibold text-[#c04f00] dark:text-[#FFBC80]">{docStatusLabel}</p>
                <Progress
                  value={docsStatus.loading || docsStatus.error ? undefined : docProgress}
                  className="mt-4 h-2 overflow-hidden rounded-full bg-white/60"
                />
                <p className="mt-3 text-xs text-black/55 dark:text-white/55">
                  {localeIsArabic
                    ? "مكتبة المستندات مُجهزة دائماً لمساعدك."
                    : "Your live library is always staged for the assistant."}
                </p>
              </div>

              <div className="flex-1 overflow-hidden rounded-[26px] border border-white/55 bg-white/70 p-4 shadow-[0_34px_96px_-70px_rgba(255,140,55,0.7)] backdrop-blur dark:border-white/10 dark:bg-white/10">
                <Suspense fallback={<SummarySkeleton />}>
                  <SummaryPanel />
                </Suspense>
              </div>

              <div className="rounded-[26px] border border-white/55 bg-white/60 p-4 text-sm text-black/60 shadow-[0_24px_70px_-60px_rgba(255,140,60,0.6)] backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white/65">
                <p className="font-semibold text-[#b05000] dark:text-[#FFB57A]">
                  {localeIsArabic ? "مزايا التحكم" : "Control highlights"}
                </p>
                <div className="mt-3 space-y-3">
                  {cockpitHighlights.map((item) => (
                    <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/60 p-3 shadow-[0_18px_60px_-56px_rgba(255,150,70,0.6)] backdrop-blur dark:border-white/10 dark:bg-white/5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8D3F] via-[#FF7120] to-[#FF5B07] text-white shadow-[0_20px_56px_-40px_rgba(255,132,52,0.75)]">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#b05000] dark:text-[#FFB77F]">{item.title}</p>
                        <p className="text-xs text-black/55 dark:text-white/55">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </main>

      <motion.footer
        className="relative z-20 mx-auto mb-4 flex w-[min(92%,1100px)] items-center justify-between rounded-full border border-white/60 bg-white/60 px-6 py-3 text-xs text-black/60 shadow-[0_26px_90px_-70px_rgba(255,138,55,0.65)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/10 dark:text-white/55"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
        <span className="font-medium text-[#a24a00] dark:text-[#FFB374]">© {currentYear} Orange Tool</span>
        <span>{localeIsArabic ? "تصميم برتقالي فاخر بلا حدود" : "Borderless premium orange design"}</span>
      </motion.footer>

      <Suspense fallback={<ChatSkeleton />}>
        <Chatbot />
      </Suspense>
      <AssistantHint />
    </div>
  );
}
