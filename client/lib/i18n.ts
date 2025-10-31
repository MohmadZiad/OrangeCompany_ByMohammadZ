export type Locale = "en" | "ar";

export const defaultLocale: Locale = "en";

export const uiStrings = {
  heroTitle: {
    en: "Orange Tool — orchestrate real-time intelligence",
    ar: "أورانج تول — ذكاء لحظي بتنسيقٍ متكامل",
  },
  heroSubtitle: {
    en: "Monitor KPIs, launch the assistant, and calculate pro-rata scenarios with effortless grace.",
    ar: "راقب المؤشرات، شغّل المساعد، واحسب سيناريوهات البرو راتا بسلاسة مذهلة.",
  },
  openAssistant: {
    en: "Open Assistant",
    ar: "افتح المساعد",
  },
  launchCalculator: {
    en: "Launch Calculator",
    ar: "إطلاق الحاسبة",
  },
  heroFootnote: {
    en: "Live orchestration for Orange Operations",
    ar: "تنفيذ حيّ لمنظومة أورانج",
  },
  kpis: [
    {
      label: { en: "Response time", ar: "زمن الاستجابة" },
      value: { en: "1.8 s", ar: "١٫٨ ث" },
      caption: {
        en: "Median across the last 1K requests",
        ar: "المتوسط خلال آخر ١٠٠٠ طلب",
      },
    },
    {
      label: { en: "Uptime", ar: "الجاهزية" },
      value: { en: "99.99%", ar: "٩٩٫٩٩٪" },
      caption: {
        en: "Weekly rolling uptime",
        ar: "معدل الجاهزية الأسبوعي",
      },
    },
    {
      label: { en: "Monitoring", ar: "المراقبة" },
      value: { en: "24/7", ar: "٢٤/٧" },
      caption: {
        en: "Operators on-call, every timezone",
        ar: "فِرَق جاهزة بكل المناطق الزمنية",
      },
    },
    {
      label: { en: "Deploy cadence", ar: "وتيرة الإطلاق" },
      value: { en: "12 / wk", ar: "١٢/أسبوع" },
      caption: {
        en: "Automated, verified, and logged",
        ar: "مؤتمت، مُتحقَّق، ومؤرشف",
      },
    },
  ],
  featureHeadline: {
    en: "Precision tooling at every layer",
    ar: "أدوات دقيقة في كل طبقة",
  },
  features: [
    {
      title: { en: "Instant outcomes", ar: "نتائج لحظية" },
      description: {
        en: "Trigger domain-specific playbooks with a single prompt.",
        ar: "شغِّل بروتوكولات متخصّصة بنقرة واحدة.",
      },
    },
    {
      title: { en: "Pro-rata intelligence", ar: "برو راتا بذكاء" },
      description: {
        en: "Simulate adjustments and share insights instantly.",
        ar: "حاكِ التعديلات وشارك الرؤى فورًا.",
      },
    },
    {
      title: { en: "Living knowledge base", ar: "مكتبة حيّة" },
      description: {
        en: "Continuous documentation with real-time sync.",
        ar: "توثيق متجدد بمزامنة لحظية.",
      },
    },
    {
      title: { en: "Governed automation", ar: "أتمتة محكومة" },
      description: {
        en: "Audit trails and layered approvals baked-in.",
        ar: "سجل تدقيق وموافقات متدرجة مدمجة.",
      },
    },
  ],
  summaryHeadline: {
    en: "Live run summary",
    ar: "ملخّص التنفيذ الحي",
  },
  calculatorTitle: {
    en: "Contribution calculator",
    ar: "حاسبة المساهمة",
  },
  proRataTitle: {
    en: "Pro-rata scenario",
    ar: "سيناريو برو راتا",
  },
  assistantTitle: {
    en: "Assistant timeline",
    ar: "سجل المساعد",
  },
  docsTitle: {
    en: "Documentation",
    ar: "الوثائق",
  },
  docsSearchPlaceholder: {
    en: "Search docs...",
    ar: "ابحث في الوثائق...",
  },
  themeLabel: {
    en: "Theme",
    ar: "النمط",
  },
  languageLabel: {
    en: "Language",
    ar: "اللغة",
  },
  betaBadge: {
    en: "Beta",
    ar: "تجريبي",
  },
  assistantCTA: {
    en: "Escalate to live expert",
    ar: "تصعيد إلى خبير مباشر",
  },
};
