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
import { MessageSquare, Sparkles, Zap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
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
  const { theme, setTheme, locale, setLocale, activeTab, setActiveTab, setChatOpen } = useAppStore();
  const [docsStatus, setDocsStatus] = useState({
    total: 0,
    loading: true,
    error: false,
  });

  useEffect(() => {
    // Initialize theme and locale from store
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
    // Handle hash-based navigation
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
        icon: <Sparkles className="h-5 w-5" />,
        title:
          locale === "ar" ? "نتائج لحظية" : "Instant outcomes",
        description:
          locale === "ar"
            ? "الأرقام تتحدّث فور إدخال القيمة الأساسية"
            : "Numbers refresh the moment you change the base price.",
      },
      {
        icon: <Zap className="h-5 w-5" />,
        title:
          locale === "ar" ? "تدفّق بروراتا ذكي" : "Smart pro-rata",
        description:
          locale === "ar"
            ? "أدر الفوترة المتغيرة مع شريط تقدم واضح"
            : "Navigate dynamic billing with crystal-clear progress bars.",
      },
      {
        icon: <BookOpen className="h-5 w-5" />,
        title:
          locale === "ar" ? "مكتبة محدثة" : "Live doc library",
        description:
          locale === "ar"
            ? "تحديثات docs تتزامن تلقائيًا مع كل جلسة"
            : "Docs sync automatically with every assistant session.",
      },
    ],
    [locale]
  );

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      {/* App Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/50 bg-white/65 shadow-[0_18px_48px_-32px_rgba(255,90,0,0.55)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:bg-black/40 dark:border-white/10">
        <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF7A00] via-[#FF5400] to-[#FF3C00] text-xl font-bold text-white shadow-[0_20px_40px_-30px_rgba(255,90,0,0.85)]">
              O
            </div>
            <div>
              <motion.h1
                className="text-2xl font-semibold sm:text-3xl"
                data-testid="text-app-title"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              >
                {t("appTitle", locale)}
              </motion.h1>
              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.6, ease: "easeOut" }}
              >
                {locale === "ar"
                  ? "منصة ذكية لحسابات دقيقة وتجربة فاخرة"
                  : "Premium calculators & assistance for faster, sharper decisions."}
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
              className="hidden sm:flex hover-elevate active-elevate-2"
              data-testid="button-help"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {t("help", locale)}
            </Button>
            <ThemeToggle />
            <LanguageToggle />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative z-10 flex-1 px-4 py-10 sm:px-6 sm:py-12">
        <motion.section
          className="mb-12 grid gap-6 lg:grid-cols-[2fr_minmax(0,1fr)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            whileHover={{ translateY: -4 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-gradient-to-br from-[#FF8140] via-[#FF5D2D] to-[#FF3C00] p-8 text-white shadow-[0_70px_140px_-70px_rgba(255,90,0,0.65)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="max-w-xl space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                  {locale === "ar" ? "لوحة تحكم أورنج" : "Orange control center"}
                </p>
                <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                  {heroTitle}
                </h2>
                <p className="text-sm text-white/80 sm:text-base">{heroSubtitle}</p>
              </div>
              <Badge
                variant="secondary"
                className="rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur"
              >
                {locale === "ar" ? "متوافق مع Vercel" : "Vercel-ready"}
              </Badge>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-3xl bg-white/15 p-4 shadow-[0_18px_32px_-26px_rgba(0,0,0,0.45)] backdrop-blur"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
                    {stat.icon}
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{stat.title}</h3>
                  <p className="mt-2 text-xs text-white/75">{stat.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="rounded-full bg-white px-6 text-sm font-semibold text-[#FF4B00] shadow-[0_24px_48px_-28px_rgba(255,255,255,0.55)] hover:bg-white/90"
                onClick={() => {
                  setActiveTab("calculator");
                  window.location.hash = "calculator";
                }}
              >
                {locale === "ar" ? "ابدأ بالحاسبة" : "Launch calculator"}
              </Button>
              <Button
                variant="ghost"
                className="rounded-full border border-white/40 px-5 text-sm font-semibold text-white hover:bg-white/15"
                onClick={() => {
                  setActiveTab("assistant");
                  setChatOpen(true);
                  window.location.hash = "assistant";
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {locale === "ar" ? "افتح المساعد" : "Open assistant"}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_40px_90px_-60px_rgba(255,90,0,0.45)] backdrop-blur-xl dark:bg-white/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF7A00] via-[#FF5400] to-[#FF3C00] text-white shadow-[0_20px_48px_-28px_rgba(255,90,0,0.55)]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">
                    {locale === "ar" ? "حالة المستندات" : "Docs status"}
                  </h3>
                  <p className="text-xs text-muted-foreground">{docStatusLabel}</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="rounded-full border-white/40 bg-white/60 px-3 py-1 text-xs font-medium text-foreground"
              >
                {docBadgeLabel}
              </Badge>
            </div>
            <div className="mt-6 space-y-4">
              <Progress
                value={docsStatus.loading || docsStatus.error ? 0 : docProgress}
                className="h-2.5 overflow-hidden rounded-full bg-white/50"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="rounded-full border border-white/60 bg-white px-4 py-2 text-xs font-semibold text-foreground shadow-sm hover:bg-white/90"
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
                  className="rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-white/80"
                  onClick={() => {
                    window.open("/api/docs", "_blank", "noopener,noreferrer");
                  }}
                >
                  {locale === "ar" ? "عرض JSON الخام" : "Raw docs JSON"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <div className="grid gap-8 lg:grid-cols-[1.618fr_minmax(0,1fr)] xl:grid-cols-[1.75fr_minmax(0,1fr)]">
          {/* Main Content Area */}
          <div data-reveal>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-8">
              <TabsList className="grid w-full grid-cols-3" data-testid="tabs-main">
                <TabsTrigger value="calculator" data-testid="tab-calculator">
                  {t("calculator", locale)}
                </TabsTrigger>
                <TabsTrigger value="pro-rata" data-testid="tab-pro-rata">
                  {t("proRata", locale)}
                </TabsTrigger>
                <TabsTrigger value="assistant" data-testid="tab-assistant">
                  {t("assistant", locale)}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calculator" className="mt-0" data-reveal>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Suspense fallback={<CalculatorSkeleton />}>
                    <OrangeCalculator />
                  </Suspense>
                </motion.div>
              </TabsContent>

              <TabsContent value="pro-rata" className="mt-0" data-reveal>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Suspense fallback={<ProRataSkeleton />}>
                    <ProRataCalculator />
                  </Suspense>
                </motion.div>
              </TabsContent>

              <TabsContent value="assistant" className="mt-0" data-reveal>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    {t("chatTitle", locale)}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t("chatPlaceholder", locale)}
                  </p>
                  <Button
                    onClick={() => setChatOpen(true)}
                    size="lg"
                    data-testid="button-open-assistant"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    {t("help", locale)}
                  </Button>
                </motion.div>
              </TabsContent>
            </Tabs>
            <div className="mt-8 lg:hidden" data-reveal>
              <Suspense fallback={<SummarySkeleton />}>
                <SummaryPanelMobile />
              </Suspense>
            </div>
          </div>

          {/* Summary Panel (Desktop only) */}
          <aside className="hidden lg:block" data-reveal>
            <Suspense fallback={<SummarySkeleton />}>
              <SummaryPanel />
            </Suspense>
          </aside>
        </div>
      </main>

      {/* Chatbot */}
      <Suspense fallback={<ChatSkeleton />}>
        <Chatbot />
      </Suspense>
      <AssistantHint />
    </div>
  );
}
