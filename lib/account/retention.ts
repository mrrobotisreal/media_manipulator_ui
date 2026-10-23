// Pure helpers for the account screen's retention UI (MM25). No React, no network.
//
// The server owns every rule (internal/retention: 24 h to 17,520 h, default 4,320 h); these
// helpers only turn the server's hours into labels and presets and validate the one free-form
// field. `limits` from GET /api/account/settings always wins over the fallbacks below.

import type { HistoryEntry, RetentionPreview } from '@/lib/auth/accountApi';

export const FALLBACK_LIMITS = { minHours: 24, maxHours: 17520, defaultHours: 4320 } as const;

export const RETENTION_PRESETS = [
  { id: 'h24', hours: 24 },
  { id: 'd7', hours: 168 },
  { id: 'd30', hours: 720 },
  { id: 'd90', hours: 2160 },
  { id: 'm6', hours: 4320 },
  { id: 'y1', hours: 8760 },
  { id: 'y2', hours: 17520 },
] as const;

export type PresetId = (typeof RETENTION_PRESETS)[number]['id'];
export const CUSTOM_ID = 'custom' as const;
export const RECOMMENDED_PRESET: PresetId = 'm6';

/** The preset whose hours match exactly, or null (the picker then shows Custom). */
export function presetForHours(hours: number): PresetId | null {
  return RETENTION_PRESETS.find((p) => p.hours === hours)?.id ?? null;
}

export const CUSTOM_MIN_DAYS = 1;
export const CUSTOM_MAX_DAYS = 730;

export type CustomParse = { ok: true; days: number; hours: number } | { ok: false };

/** "Custom" is whole days, 1 to 730, converted to hours and clamped into the server's limits. */
export function parseCustomDays(
  raw: string,
  limits: { minHours: number; maxHours: number } = FALLBACK_LIMITS,
): CustomParse {
  const text = raw.trim();
  if (!/^\d+$/.test(text)) return { ok: false };
  const days = Number(text);
  if (days < CUSTOM_MIN_DAYS || days > CUSTOM_MAX_DAYS) return { ok: false };
  return { ok: true, days, hours: Math.min(limits.maxHours, Math.max(limits.minHours, days * 24)) };
}

/** Everything the shrink would delete, as one count (the dialog is skipped at zero). */
export function previewTotal(preview: RetentionPreview): number {
  const w = preview.wouldDelete;
  return w.results + w.projects + w.other;
}

/** The "Keep longer" menu. */
export const KEEP_OPTIONS = [
  { id: 'week', hours: 168 },
  { id: 'month', hours: 720 },
  { id: 'sixMonths', hours: 4320 },
  { id: 'year', hours: 8760 },
] as const;

export type KeepOptionId = (typeof KEEP_OPTIONS)[number]['id'];

/** The deadline shown on a row: the ledger's `deletesOn`, falling back to the pre-ledger field. */
export function deadlineOf(entry: HistoryEntry): string | undefined {
  return entry.deletesOn || entry.resultExpiresAt || undefined;
}

const DAY_MS = 86_400_000;

/** Live (not expired) and due within `days` days. */
export function isExpiringSoon(entry: HistoryEntry, now: number, days = 7): boolean {
  if (entry.expired) return false;
  const iso = deadlineOf(entry);
  if (!iso) return false;
  const at = Date.parse(iso);
  return Number.isFinite(at) && at - now < days * DAY_MS;
}

export interface HistoryFilters {
  kind: string;
  tool: string;
  /** yyyy-mm-dd from a date input, local time. '' = open. */
  from: string;
  to: string;
  expiringSoon: boolean;
}

export const NO_FILTERS: HistoryFilters = { kind: '', tool: '', from: '', to: '', expiringSoon: false };

export function hasActiveFilters(f: HistoryFilters): boolean {
  return !!(f.kind || f.tool || f.from || f.to || f.expiringSoon);
}

/** The id the History tab labels and filters a row by. */
export function toolIdOf(entry: HistoryEntry): string {
  return entry.tool || entry.mode || 'convert';
}

function startOfLocalDay(ymd: string): number {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).getTime();
}

/** Client-side filtering: GET /api/account/history takes only limit and offset. */
export function filterHistory(entries: HistoryEntry[], f: HistoryFilters, now: number): HistoryEntry[] {
  const from = f.from ? startOfLocalDay(f.from) : null;
  const to = f.to ? startOfLocalDay(f.to) + DAY_MS : null;
  return entries.filter((e) => {
    if (f.kind && (e.mediaKind ?? '') !== f.kind) return false;
    if (f.tool && toolIdOf(e) !== f.tool) return false;
    const created = Date.parse(e.createdAt);
    if (from !== null && !(created >= from)) return false;
    if (to !== null && !(created < to)) return false;
    if (f.expiringSoon && !isExpiringSoon(e, now)) return false;
    return true;
  });
}

/** `{{name}}` interpolation for labels that arrive as plain strings from the server page. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => (key in vars ? String(vars[key]) : ''));
}

/** "in 11 days" / "tomorrow", locale-aware; '' when the date is unusable. */
export function relativeDays(iso: string, now: number, locale: string): string {
  const at = Date.parse(iso);
  if (!Number.isFinite(at)) return '';
  const days = Math.round((at - now) / DAY_MS);
  try {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(days, 'day');
  } catch {
    return '';
  }
}
