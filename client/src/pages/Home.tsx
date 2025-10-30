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
import { motion, useScroll, useTransform } from "framer-motion";
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

  const { scrollYProgress } = useScroll();
  const parallax = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const parallaxSecondary = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-white/40 bg-white/55 shadow-[0_32px_120px_-60px_rgba(255,125,40,0.6)] backdrop-blur-2xl transition dark:border-white/10 dark:bg-[#1c130f]/80">
        <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="flex items-center gap-4"
          >
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6A00] via-[#FF8A33] to-[#FFA94D] text-xl font-bold text-white shadow-[0_26px_60px_-30px_rgba(255,120,30,0.85)]">
              <span className="drop-shadow-[0_2px_8px_rgba(255,140,64,0.65)]">O</span>
            </div>
            <div className="space-y-1">
              <motion.h1
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
                data-testid="text-app-title"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {t("appTitle", locale)}
              </motion.h1>
              <motion.p
                className="text-xs text-black/60 dark:text-white/60 sm:text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {locale === "ar"
                  ? "منصة عالمية لحسابات دقيقة ومحادثات أنيقة."
                  : "A global cockpit for precise pricing and elegant conversations."}
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
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
              className="hidden sm:flex rounded-full border border-white/30 bg-white/40 px-4 text-xs font-semibold text-foreground shadow-[0_18px_45px_-30px_rgba(255,120,30,0.65)] backdrop-blur hover:-translate-y-0.5 hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-offset-2"
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

      <main className="container relative z-10 flex-1 px-4 pb-24 pt-12 sm:px-6">
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-[-1] h-[420px]"
          style={{ translateY: parallax }}
          aria-hidden
        >
          <div className="mx-auto h-full max-w-5xl rounded-[4rem] bg-gradient-to-b from-[#FFF5EC]/80 via-[#FFE8D2]/40 to-transparent blur-2xl" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[-160px] z-[-1] h-[380px]"
          style={{ translateY: parallaxSecondary }}
          aria-hidden
        >
          <div className="mx-auto h-full max-w-6xl rounded-[4rem] bg-gradient-to-t from-[#1d120a]/40 via-[#2a1b12]/20 to-transparent blur-3xl dark:from-[#140b07]/70" />
        </motion.div>

        <motion.section
          data-reveal
          className="relative overflow-hidden rounded-[3rem] border border-white/60 bg-white/70 p-10 shadow-[0_70px_160px_-80px_rgba(255,120,30,0.75)] backdrop-blur-3xl transition dark:border-white/10 dark:bg-[#1f140e]/80"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <motion.div
            className="absolute inset-0 -z-[1] opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-[#FF6A00]/50 via-[#FF9850]/35 to-transparent blur-3xl" />
            <div className="absolute -left-14 bottom-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#FFB678]/45 via-[#FFE2C5]/30 to-transparent blur-3xl" />
          </motion.div>
          <div className="grid gap-10 lg:grid-cols-[1.8fr_minmax(0,1fr)]">
            <div className="space-y-8">
              <div className="space-y-5">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#d65a00] shadow-[0_16px_40px_-32px_rgba(255,120,30,0.65)] backdrop-blur">
                  {locale === "ar" ? "الهوية العالمية" : "Global identity"}
                </p>
                <motion.h2
                  className="text-4xl font-semibold leading-tight text-[#2c1606] drop-shadow-[0_10px_40px_rgba(255,210,180,0.55)] dark:text-white sm:text-5xl"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {heroTitle}
                </motion.h2>
                <motion.p
                  className="max-w-2xl text-base text-black/70 dark:text-white/70 sm:text-lg"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                >
                  {heroSubtitle}
                </motion.p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF8A33] to-[#FFA94D] px-6 text-sm font-semibold text-white shadow-[0_35px_80px_-40px_rgba(255,120,30,0.9)] transition hover:scale-[1.02] hover:shadow-[0_45px_95px_-50px_rgba(255,140,60,0.9)]"
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
                  className="rounded-full border border-white/60 bg-white/70 px-6 text-sm font-semibold text-[#cc5400] shadow-[0_25px_70px_-45px_rgba(255,140,60,0.6)] backdrop-blur hover:-translate-y-0.5 hover:bg-white/90 dark:bg-white/10 dark:text-white"
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
                    transition={{ delay: 0.25 + index * 0.08, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                    className="rounded-3xl border border-white/60 bg-white/65 p-4 text-[#4a2a14] shadow-[0_28px_80px_-54px_rgba(255,140,60,0.75)] backdrop-blur dark:border-white/5 dark:bg-white/5 dark:text-white"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-[#d65a00] dark:text-[#FFB267]">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
                    <p className="mt-1 text-xs text-black/55 dark:text-white/60">{stat.caption}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              className="relative rounded-[2.4rem] border border-white/60 bg-white/80 p-6 shadow-[0_40px_120px_-70px_rgba(255,140,60,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.2, 1, 0.22, 1] }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6A00] via-[#FF8A33] to-[#FFA94D] text-white shadow-[0_25px_60px_-38px_rgba(255,140,60,0.75)]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#2c1606] dark:text-white">
                      {locale === "ar" ? "حالة المستندات" : "Docs status"}
                    </h3>
                    <p className="text-xs text-muted-foreground">{docStatusLabel}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-white/50 bg-white/80 px-3 py-1 text-xs font-semibold text-[#d65a00] backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-white"
                >
                  {docBadgeLabel}
                </Badge>
              </div>
              <div className="mt-6 space-y-4">
                <Progress
                  value={docsStatus.loading || docsStatus.error ? 0 : docProgress}
                  className="h-2.5 overflow-hidden rounded-full bg-white/50 dark:bg-white/10"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {cockpitTiles.map((tile) => (
                    <motion.div
                      key={tile.title}
                      whileHover={{ y: -4 }}
                      className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-[0_20px_70px_-50px_rgba(255,120,30,0.65)] backdrop-blur dark:border-white/10 dark:bg-white/10"
                    >
                      <div className="flex items-center gap-2 text-[#d65a00] dark:text-[#FFB267]">
                        {tile.icon}
                        <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                          {tile.title}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-[#4a2a14] dark:text-white/70">{tile.body}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="rounded-full border border-white/60 bg-white/80 px-4 py-2 text-xs font-semibold text-[#d65a00] shadow-sm transition hover:bg-white hover:shadow-[0_26px_70px_-52px_rgba(255,150,70,0.7)] dark:bg-white/10 dark:text-white"
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
                    className="rounded-full border border-white/50 px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-white/70 dark:border-white/20 dark:hover:bg-white/10"
                    onClick={() => {
                      window.open("/api/docs", "_blank", "noopener,noreferrer");
                    }}
                  >
                    {locale === "ar" ? "عرض JSON الخام" : "Raw docs JSON"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section data-reveal className="mt-16 space-y-6">
          <motion.h3
            className="text-xl font-semibold tracking-tight text-[#2c1606] dark:text-white"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            {locale === "ar" ? "طبقات الحركة" : "Animation layers"}
          </motion.h3>
          <div className="grid gap-6 lg:grid-cols-3">
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -6, rotateX: 1 }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="relative overflow-hidden rounded-[2.3rem] border border-white/60 bg-white/75 p-6 shadow-[0_45px_120px_-80px_rgba(255,140,60,0.75)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/10"
              >
                <div className="absolute -top-12 right-0 h-32 w-32 rounded-full bg-gradient-to-br from-[#FF7A1A]/40 via-[#FFB267]/25 to-transparent blur-3xl" />
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6A00] via-[#FF8A33] to-[#FFA94D] text-white shadow-[0_20px_60px_-45px_rgba(255,140,60,0.75)]">
                  {feature.icon}
                </div>
                <h4 className="mt-6 text-lg font-semibold text-[#2c1606] dark:text-white">
                  {feature.title}
                </h4>
                <p className="mt-3 text-sm text-black/65 dark:text-white/65">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section data-reveal className="mt-20 grid gap-10 lg:grid-cols-[1.75fr_minmax(0,1fr)] xl:grid-cols-[2fr_minmax(0,1fr)]">
          <div className="space-y-10">
            <motion.div
              className="rounded-[2.6rem] border border-white/60 bg-white/70 p-6 shadow-[0_45px_120px_-80px_rgba(255,130,50,0.7)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/10"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            >
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-8">
                <TabsList
                  className="grid w-full grid-cols-3 rounded-full border border-white/50 bg-white/70 p-1 shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/10"
                  data-testid="tabs-main"
                >
                  <TabsTrigger
                    value="calculator"
                    data-testid="tab-calculator"
                    className="rounded-full px-4 py-2 text-sm font-semibold transition data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6A00] data-[state=active]:via-[#FF8A33] data-[state=active]:to-[#FFA94D] data-[state=active]:text-white"
                  >
                    {t("calculator", locale)}
                  </TabsTrigger>
                  <TabsTrigger
                    value="pro-rata"
                    data-testid="tab-pro-rata"
                    className="rounded-full px-4 py-2 text-sm font-semibold transition data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6A00] data-[state=active]:via-[#FF8A33] data-[state=active]:to-[#FFA94D] data-[state=active]:text-white"
                  >
                    {t("proRata", locale)}
                  </TabsTrigger>
                  <TabsTrigger
                    value="assistant"
                    data-testid="tab-assistant"
                    className="rounded-full px-4 py-2 text-sm font-semibold transition data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6A00] data-[state=active]:via-[#FF8A33] data-[state=active]:to-[#FFA94D] data-[state=active]:text-white"
                  >
                    {t("assistant", locale)}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="calculator" className="mt-0" data-reveal>
                  <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                  >
                    <Suspense fallback={<CalculatorSkeleton />}>
                      <OrangeCalculator />
                    </Suspense>
                  </motion.div>
                </TabsContent>

                <TabsContent value="pro-rata" className="mt-0" data-reveal>
                  <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                  >
                    <Suspense fallback={<ProRataSkeleton />}>
                      <ProRataCalculator />
                    </Suspense>
                  </motion.div>
                </TabsContent>

                <TabsContent value="assistant" className="mt-0" data-reveal>
                  <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                    className="rounded-[2.3rem] border border-white/60 bg-gradient-to-br from-white/85 via-white/60 to-white/30 p-10 text-center shadow-[0_45px_120px_-80px_rgba(255,120,30,0.65)] backdrop-blur-2xl dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/5"
                  >
                    <MessageSquare className="mx-auto mb-4 h-14 w-14 text-[#FF7A1A] drop-shadow-[0_14px_50px_rgba(255,140,60,0.6)]" />
                    <h3 className="text-2xl font-semibold text-[#2c1606] dark:text-white">
                      {t("chatTitle", locale)}
                    </h3>
                    <p className="mt-3 text-sm text-black/60 dark:text-white/65">
                      {t("chatPlaceholder", locale)}
                    </p>
                    <Button
                      onClick={() => setChatOpen(true)}
                      size="lg"
                      data-testid="button-open-assistant"
                      className="mt-6 rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF8A33] to-[#FFA94D] px-6 text-sm font-semibold text-white shadow-[0_35px_90px_-50px_rgba(255,140,60,0.75)] transition hover:scale-[1.02]"
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      {t("help", locale)}
                    </Button>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>

            <motion.aside
              className="hidden rounded-[2.6rem] border border-white/60 bg-white/75 p-6 shadow-[0_45px_120px_-80px_rgba(255,140,60,0.7)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/10 lg:block"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            >
              <Suspense fallback={<SummarySkeleton />}>
                <SummaryPanel />
              </Suspense>
            </motion.aside>

            <div className="lg:hidden" data-reveal>
              <Suspense fallback={<SummarySkeleton />}>
                <SummaryPanelMobile />
              </Suspense>
            </div>
          </div>
        </motion.section>

        <motion.footer
          data-reveal
          className="mt-24 flex flex-col items-center justify-between gap-4 rounded-full border border-white/40 bg-white/60 px-6 py-4 text-xs text-muted-foreground shadow-[0_35px_110px_-70px_rgba(255,130,50,0.6)] backdrop-blur-lg dark:border-white/10 dark:bg-white/10 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        >
          <span className="font-medium text-[#ae4a00] dark:text-white/70">© {currentYear} Orange Tool</span>
          <span>{locale === "ar" ? "تصميم برتقالي عالمي" : "World-class orange identity"}</span>
        </motion.footer>
      </main>

      <Suspense fallback={<ChatSkeleton />}>
        <Chatbot />
      </Suspense>
      <AssistantHint />
    </div>
  );
}
