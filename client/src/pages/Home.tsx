import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
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
import { motion } from "framer-motion";
import { AssistantHint } from "@/components/AssistantHint";

function CalculatorSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20 rounded-2xl" />
      <Skeleton className="h-[320px] rounded-2xl" />
    </div>
  );
}

function ProRataSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20 rounded-2xl" />
      <Skeleton className="h-[280px] rounded-2xl" />
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32 rounded-full" />
      <Skeleton className="h-[320px] rounded-2xl" />
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-500)] text-white shadow-lg">
      <MessageSquare className="h-6 w-6" />
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

  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="neo-app-shell">
        <section className="neo-pane">
          <header className="neo-pane__header">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-500)] text-lg font-semibold text-white shadow-sm">
                O
              </div>
              <div className="space-y-1">
                <motion.h1
                  className="text-2xl font-semibold tracking-tight neo-gradient"
                  data-testid="text-app-title"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {t("appTitle", locale)}
                </motion.h1>
                <motion.p
                  className="text-sm text-[var(--muted)]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {locale === "ar"
                    ? "منصة عالمية لحسابات دقيقة ومحادثات أنيقة."
                    : "A global cockpit for precise pricing and elegant conversations."}
                </motion.p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setChatOpen(true);
                  setActiveTab("assistant");
                  window.location.hash = "assistant";
                }}
                className="neo-btn hidden sm:inline-flex items-center gap-2 rounded-full px-4 text-sm"
                data-testid="button-help"
              >
                <MessageSquare className="h-4 w-4" />
                {t("help", locale)}
              </Button>
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </header>
          <div className="neo-pane__body">
            <div className="neo-scroll space-y-6">
              <motion.section
                className="neo-card space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
                    {locale === "ar" ? "الهوية العالمية" : "Global identity"}
                  </p>
                  <h2 className="neo-gradient text-3xl font-semibold leading-tight sm:text-4xl">
                    {heroTitle}
                  </h2>
                  <p className="text-sm text-[var(--muted)] sm:text-base">
                    {heroSubtitle}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="neo-btn flex items-center gap-2"
                    onClick={() => {
                      setActiveTab("assistant");
                      setChatOpen(true);
                      window.location.hash = "assistant";
                    }}
                  >
                    <Sparkles className="h-5 w-5" />
                    {locale === "ar" ? "افتح المساعد" : "Open assistant"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="neo-btn neo-btn--ghost flex items-center gap-2"
                    onClick={() => {
                      setActiveTab("calculator");
                      window.location.hash = "calculator";
                    }}
                  >
                    <Zap className="h-5 w-5" />
                    {locale === "ar" ? "إطلاق الحاسبة" : "Launch calculator"}
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="neo-card border border-transparent bg-white/70 p-4 text-sm shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand-500)]">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{stat.caption}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                className="neo-card space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-100)] text-[var(--brand-600)]">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[var(--foreground)]">
                        {locale === "ar" ? "حالة المستندات" : "Docs status"}
                      </h3>
                      <p className="text-xs text-[var(--muted)]">{docStatusLabel}</p>
                    </div>
                  </div>
                  <Badge className="rounded-full bg-[var(--brand-50)] px-3 py-1 text-xs font-semibold text-[var(--brand-600)]">
                    {docBadgeLabel}
                  </Badge>
                </div>
                <Progress
                  value={docsStatus.loading || docsStatus.error ? 0 : docProgress}
                  className="h-2 rounded-full"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {cockpitTiles.map((tile) => (
                    <div key={tile.title} className="neo-card border border-transparent bg-white/70 p-4 text-sm shadow-sm">
                      <div className="flex items-center gap-2 text-[var(--brand-600)]">
                        {tile.icon}
                        <span className="text-xs font-semibold uppercase tracking-[0.3em]">
                          {tile.title}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-[var(--muted)]">{tile.body}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="neo-btn neo-btn--ghost"
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
                    className="neo-btn neo-btn--ghost"
                    onClick={() => {
                      window.open("/api/docs", "_blank", "noopener,noreferrer");
                    }}
                  >
                    {locale === "ar" ? "عرض JSON الخام" : "Raw docs JSON"}
                  </Button>
                </div>
              </motion.section>

              <motion.section
                className="neo-card space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col gap-4" data-testid="tabs-main">
                  {/* ✅ TabsList يحفظ سياق RovingFocusGroup */}
                  <TabsList className="neo-dock">
                    <TabsTrigger
                      value="calculator"
                      data-testid="tab-calculator"
                      className="neo-dock__btn"
                    >
                      {t("calculator", locale)}
                    </TabsTrigger>
                    <TabsTrigger
                      value="pro-rata"
                      data-testid="tab-pro-rata"
                      className="neo-dock__btn"
                    >
                      {t("proRata", locale)}
                    </TabsTrigger>
                    <TabsTrigger
                      value="assistant"
                      data-testid="tab-assistant"
                      className="neo-dock__btn"
                    >
                      {t("assistant", locale)}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="calculator" className="neo-swap-enter">
                    <div className="neo-card neo-scroll min-h-[280px] p-4">
                      <Suspense fallback={<CalculatorSkeleton />}>
                        <OrangeCalculator />
                      </Suspense>
                    </div>
                  </TabsContent>

                  <TabsContent value="pro-rata" className="neo-swap-enter">
                    <div className="neo-card neo-scroll min-h-[280px] p-4">
                      <Suspense fallback={<ProRataSkeleton />}>
                        <ProRataCalculator />
                      </Suspense>
                    </div>
                  </TabsContent>

                  <TabsContent value="assistant" className="neo-swap-enter">
                    <div className="neo-card neo-scroll min-h-[240px] p-6 text-center">
                      <MessageSquare className="mx-auto mb-4 h-12 w-12 text-[var(--brand-500)]" />
                      <h3 className="text-xl font-semibold text-[var(--foreground)]">
                        {t("chatTitle", locale)}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {t("chatPlaceholder", locale)}
                      </p>
                      <Button
                        onClick={() => setChatOpen(true)}
                        size="lg"
                        data-testid="button-open-assistant"
                        className="neo-btn mt-6 inline-flex items-center gap-2"
                      >
                        <MessageSquare className="h-5 w-5" />
                        {t("help", locale)}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.section>
            </div>
          </div>
        </section>

        <section className="neo-pane">
          <header className="neo-pane__header">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                {localeIsArabic ? "ملخص" : "Summary"}
              </span>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                {localeIsArabic ? "لوحة النتائج" : "Results board"}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted)]">{docStatusLabel}</span>
              <Badge className="rounded-full bg-[var(--brand-500)] px-3 py-1 text-xs font-semibold text-white">
                {docBadgeLabel}
              </Badge>
            </div>
          </header>
          <div className="neo-pane__body">
            <div className="neo-scroll space-y-6">
              <motion.section
                className="neo-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <Suspense fallback={<SummarySkeleton />}>
                  <div className="hidden lg:block">
                    <SummaryPanel />
                  </div>
                </Suspense>
                <div className="lg:hidden">
                  <Suspense fallback={<SummarySkeleton />}>
                    <SummaryPanelMobile />
                  </Suspense>
                </div>
              </motion.section>

              <motion.section
                className="neo-card space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  {localeIsArabic ? "طبقات الحركة" : "Animation layers"}
                </h3>
                <div className="grid gap-3 md:grid-cols-3">
                  {featureCards.map((feature) => (
                    <div key={feature.title} className="neo-card border border-transparent bg-white/70 p-4 text-sm shadow-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-100)] text-[var(--brand-600)]">
                        {feature.icon}
                      </div>
                      <h4 className="mt-4 text-base font-semibold text-[var(--foreground)]">
                        {feature.title}
                      </h4>
                      <p className="mt-2 text-sm text-[var(--muted)]">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                className="neo-card flex flex-col gap-3 text-xs text-[var(--muted)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>© {currentYear} Orange Tool</span>
                  <span>
                    {localeIsArabic ? "تصميم برتقالي عالمي" : "World-class orange identity"}
                  </span>
                </div>
              </motion.section>
            </div>
          </div>
        </section>
      </div>

      <Suspense fallback={<ChatSkeleton />}>
        <Chatbot />
      </Suspense>
      <AssistantHint />
    </>
  );
}
