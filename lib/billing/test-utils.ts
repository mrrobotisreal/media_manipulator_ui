// Shared test doubles for the billing UI suites. Keys render as themselves so assertions
// read as "this exact string key was shown", independent of copy edits.
export function fakeLocalization() {
  const t = (key: string, opts?: Record<string, unknown>) => {
    const vals = opts && !('defaultValue' in opts) ? Object.entries(opts).filter(([k]) => k !== 'returnObjects') : [];
    return vals.length ? `${key}|${vals.map(([k, v]) => `${k}=${String(v)}`).join(',')}` : key;
  };
  return {
    t,
    language: { code: 'en-US' },
    formatDate: (d: string) => `D(${d})`,
  };
}
