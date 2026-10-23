import { describe, expect, it } from 'vitest';
import { filterHistory, NO_FILTERS, parseCustomDays, presetForHours, fmt, isExpiringSoon } from './retention';
import { parseAccountTab } from './tabs';

describe('retention helpers', () => {
  it('maps hours to presets', () => {
    expect(presetForHours(4320)).toBe('m6');
    expect(presetForHours(24)).toBe('h24');
    expect(presetForHours(100)).toBeNull();
  });
  it('parses custom days: integers 1-730 only, converted to hours', () => {
    expect(parseCustomDays('45')).toEqual({ ok: true, days: 45, hours: 1080 });
    expect(parseCustomDays('730')).toEqual({ ok: true, days: 730, hours: 17520 });
    for (const bad of ['', '0', '731', '1.5', '-3', 'abc', '1e2']) expect(parseCustomDays(bad).ok).toBe(false);
  });
  it('clamps hours into the server limits', () => {
    expect(parseCustomDays('1', { minHours: 48, maxHours: 100 })).toEqual({ ok: true, days: 1, hours: 48 });
  });
  it('interpolates {{vars}}', () => {
    expect(fmt('a {{x}} b {{y}}', { x: 1, y: 'z' })).toBe('a 1 b z');
  });
  it('expiring soon excludes expired rows and far deadlines', () => {
    const now = Date.parse('2026-10-23T00:00:00Z');
    const base = { jobId: 'a', status: 'completed', createdAt: '', expired: false } as const;
    expect(isExpiringSoon({ ...base, deletesOn: '2026-10-25T00:00:00Z' }, now)).toBe(true);
    expect(isExpiringSoon({ ...base, deletesOn: '2026-12-25T00:00:00Z' }, now)).toBe(false);
    expect(isExpiringSoon({ ...base, expired: true, deletesOn: '2026-10-25T00:00:00Z' }, now)).toBe(false);
    expect(isExpiringSoon({ ...base }, now)).toBe(false);
  });
  it('filters by date range inclusive of the end day', () => {
    const e = (id: string, createdAt: string) => ({ jobId: id, status: 'completed' as const, createdAt, expired: false });
    const rows = [e('a', '2026-10-01T12:00:00'), e('b', '2026-10-05T12:00:00')];
    const out = filterHistory(rows, { ...NO_FILTERS, from: '2026-10-05', to: '2026-10-05' }, 0);
    expect(out.map((r) => r.jobId)).toEqual(['b']);
  });
});

describe('parseAccountTab', () => {
  it('accepts the six tabs and falls back to overview', () => {
    for (const t of ['overview', 'history', 'projects', 'billing', 'privacy', 'profile']) expect(parseAccountTab(t)).toBe(t);
    expect(parseAccountTab('nope')).toBe('overview');
    expect(parseAccountTab(null)).toBe('overview');
    expect(parseAccountTab(undefined)).toBe('overview');
  });
});
