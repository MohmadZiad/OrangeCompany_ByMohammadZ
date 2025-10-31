export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

type Locale = "en" | "ar";

type TranslationRecord = Record<Locale, string>;

export function t(record: TranslationRecord, locale: Locale) {
  return record[locale];
}

type FormatNumberOptions = {
  locale: Locale;
  style?: Intl.NumberFormatOptions["style"];
  maximumFractionDigits?: number;
};

export function formatNumber(value: number, options: FormatNumberOptions) {
  const { locale, ...rest } = options;
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", rest).format(value);
}
