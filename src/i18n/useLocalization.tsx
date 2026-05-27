import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  LANGUAGE_STORAGE_KEY,
  supportedLanguages,
  defaultLanguage,
} from "./index";
import type { SupportedLanguage } from "./resources";

// `Intl.ListFormat` exists in all modern browsers we target (Chrome 72+,
// Safari 14+, Firefox 78+, Node 18+), but is not in the TS dom lib until
// ES2021. Re-declare the slice we use so we can format unit lists without
// upgrading the entire tsconfig lib target.
type ListFormatCtor = new (
  locale?: string,
  options?: { style?: "long" | "short" | "narrow"; type?: "conjunction" | "disjunction" | "unit" },
) => { format: (items: Iterable<string>) => string };
const ListFormat: ListFormatCtor | undefined = (Intl as unknown as { ListFormat?: ListFormatCtor }).ListFormat;

type FormatDateOptions = Intl.DateTimeFormatOptions;

/**
 * Returns `value` as a localized date string. Accepts Date, timestamp, or
 * date-string. Falls back to the current locale's short date format.
 */
const buildFormatDate =
  (locale: string) =>
  (
    value: Date | string | number,
    options: FormatDateOptions = { year: "numeric", month: "short", day: "numeric" },
  ): string => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    try {
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  };

const buildFormatTime =
  (locale: string) =>
  (
    value: Date | string | number,
    options: FormatDateOptions = { hour: "numeric", minute: "2-digit", second: "2-digit" },
  ): string => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    try {
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch {
      return date.toLocaleTimeString();
    }
  };

const buildFormatNumber =
  (locale: string) =>
  (value: number, options?: Intl.NumberFormatOptions): string => {
    if (!Number.isFinite(value)) return "";
    try {
      return new Intl.NumberFormat(locale, options).format(value);
    } catch {
      return String(value);
    }
  };

/**
 * Format a number of seconds as `HH:MM:SS` (or `MM:SS` for sub-hour values).
 * Used for media playback timestamps.
 */
const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (hrs > 0) return `${hrs}:${pad(mins)}:${pad(secs)}`;
  return `${mins}:${pad(secs)}`;
};

/**
 * Format a duration in seconds as a localized human-readable string, e.g.
 * "2 hr 14 min", "47 sec". Honors the active i18n language for unit labels.
 */
const buildFormatReadableDuration =
  (locale: string, t: (key: string, opts?: Record<string, unknown>) => string) =>
  (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return t("duration.zero", { defaultValue: "0 sec" });
    }
    const total = Math.floor(seconds);
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    const parts: string[] = [];
    if (hrs > 0) parts.push(t("duration.hours", { count: hrs, defaultValue: `${hrs} hr` }));
    if (mins > 0) parts.push(t("duration.minutes", { count: mins, defaultValue: `${mins} min` }));
    if (secs > 0 && hrs === 0) parts.push(t("duration.seconds", { count: secs, defaultValue: `${secs} sec` }));
    if (parts.length === 0) {
      return t("duration.seconds", { count: 0, defaultValue: "0 sec" });
    }
    // Use a list formatter where available so RTL / CJK rendering stays correct.
    if (ListFormat) {
      try {
        return new ListFormat(locale, { style: "narrow", type: "unit" }).format(parts);
      } catch {
        return parts.join(" ");
      }
    }
    return parts.join(" ");
  };

const buildFormatFileSize =
  (locale: string, t: (key: string, opts?: Record<string, unknown>) => string) =>
  (bytes: number, fractionDigits = 2): string => {
    if (!Number.isFinite(bytes) || bytes < 0) return "";
    if (bytes === 0) return `0 ${t("units.bytes", { defaultValue: "B" })}`;
    const units = [
      t("units.bytes", { defaultValue: "B" }),
      t("units.kilobytes", { defaultValue: "KB" }),
      t("units.megabytes", { defaultValue: "MB" }),
      t("units.gigabytes", { defaultValue: "GB" }),
      t("units.terabytes", { defaultValue: "TB" }),
    ];
    const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, exp);
    try {
      return `${new Intl.NumberFormat(locale, {
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: 0,
      }).format(value)} ${units[exp]}`;
    } catch {
      return `${value.toFixed(fractionDigits)} ${units[exp]}`;
    }
  };

export interface UseLocalizationReturn {
  /** Translation function (defaults to `interface` namespace). */
  t: ReturnType<typeof useTranslation>["t"];
  /** Persist + apply a new language. */
  changeLanguage: (code: string) => Promise<void>;
  /** Currently-active language descriptor. */
  language: SupportedLanguage;
  /** All languages registered in resources.ts. */
  languages: SupportedLanguage[];
  /** Active text direction (ltr | rtl). */
  dir: "ltr" | "rtl";
  /** `Intl.DateTimeFormat`-backed date formatter. */
  formatDate: ReturnType<typeof buildFormatDate>;
  /** `Intl.DateTimeFormat`-backed time formatter. */
  formatTime: ReturnType<typeof buildFormatTime>;
  /** `Intl.NumberFormat`-backed number formatter. */
  formatNumber: ReturnType<typeof buildFormatNumber>;
  /** Format seconds as `HH:MM:SS` for media timecodes. */
  formatDuration: (seconds: number) => string;
  /** Format seconds as a localized "2 hr 14 min" style string. */
  formatReadableDuration: ReturnType<typeof buildFormatReadableDuration>;
  /** Format a byte count with localized units. */
  formatFileSize: ReturnType<typeof buildFormatFileSize>;
}

export function useLocalization(namespace?: string | string[]): UseLocalizationReturn {
  const { t, i18n: i18nInstance } = useTranslation(namespace);
  const activeCode = i18nInstance.language || defaultLanguage;
  const language = useMemo<SupportedLanguage>(
    () =>
      supportedLanguages.find((l) => l.code === activeCode) ||
      supportedLanguages.find((l) => l.code === defaultLanguage) ||
      supportedLanguages[0],
    [activeCode],
  );

  const changeLanguage = useCallback(
    async (code: string) => {
      await i18nInstance.changeLanguage(code);
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
      } catch {
        // localStorage may be unavailable; the change still applies for this session.
      }
      const target = supportedLanguages.find((l) => l.code === code);
      if (typeof document !== "undefined") {
        document.documentElement.lang = code;
        document.documentElement.dir = target?.dir ?? "ltr";
      }
    },
    [i18nInstance],
  );

  const formatDate = useMemo(() => buildFormatDate(activeCode), [activeCode]);
  const formatTime = useMemo(() => buildFormatTime(activeCode), [activeCode]);
  const formatNumber = useMemo(() => buildFormatNumber(activeCode), [activeCode]);
  const tRef = t as unknown as (key: string, opts?: Record<string, unknown>) => string;
  const formatReadableDuration = useMemo(
    () => buildFormatReadableDuration(activeCode, tRef),
    [activeCode, tRef],
  );
  const formatFileSize = useMemo(
    () => buildFormatFileSize(activeCode, tRef),
    [activeCode, tRef],
  );

  return {
    t,
    changeLanguage,
    language,
    languages: supportedLanguages,
    dir: language?.dir ?? "ltr",
    formatDate,
    formatTime,
    formatNumber,
    formatDuration,
    formatReadableDuration,
    formatFileSize,
  };
}

export default useLocalization;
