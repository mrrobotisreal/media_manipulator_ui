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

/**
 * A /api/tiers body shaped like MM39 + MM43 at their config defaults (internal/config). Tests
 * read every number from here, so a component that prints a literal instead of the served
 * value fails them. Deliberately odd prices (not 8/80, 15/150) catch a hard-coded price.
 */
export function tiersFixture(over: { proPurchasable?: boolean; withPro?: boolean } = {}) {
  const GB = 1024 * 1024 * 1024;
  const motion = (exports: number, formats: string[], projects: number, height: number) => ({
    vectorExportsPerDay: exports, vectorFormats: formats, vectorProjects: projects,
    vectorMaxDurationMs: 0, vectorVideo: { maxHeight: height, maxFps: 0, maxSeconds: 15 },
  });
  const premiumFormats = ['svg_animated', 'lottie', 'react_tsx', 'js_ts', 'flutter', 'gif', 'import_lottie', 'import_svg_vectorize'];
  const tiers = [
    { tier: 'anonymous' as const, limits: { opsPerDay: 5, aiOpsPerDay: 1, exportsPerDay: 5, maxFileBytes: 200 * 1024 * 1024, maxVideoSeconds: 300, maxOutputHeight: 1080, maxLadderHeight: 720, studioProjects: 1, priorityGpu: false, resultRetentionHours: 24, adsRemoved: false, ...motion(2, ['svg_animated'], 1, 0) } },
    { tier: 'free' as const, limits: { opsPerDay: 30, aiOpsPerDay: 5, exportsPerDay: 30, maxFileBytes: GB, maxVideoSeconds: 1200, maxOutputHeight: 1440, maxLadderHeight: 1080, studioProjects: 5, priorityGpu: false, resultRetentionHours: 168, adsRemoved: false, ...motion(5, ['svg_animated', 'lottie', 'import_lottie', 'import_svg_vectorize'], 3, 0) } },
    { tier: 'premium' as const, limits: { opsPerDay: 300, aiOpsPerDay: 60, exportsPerDay: 300, maxFileBytes: 5 * GB, maxVideoSeconds: 7200, maxOutputHeight: 2160, maxLadderHeight: 2160, studioProjects: -1, priorityGpu: true, resultRetentionHours: 720, adsRemoved: true, ...motion(30, premiumFormats, 25, 720) } },
    { tier: 'pro' as const, limits: { opsPerDay: 700, aiOpsPerDay: 120, exportsPerDay: 700, maxFileBytes: 5 * GB, maxVideoSeconds: 7200, maxOutputHeight: 2160, maxLadderHeight: 2160, studioProjects: -1, priorityGpu: true, resultRetentionHours: 720, adsRemoved: true, ...motion(30, premiumFormats, 25, 720) } },
  ];
  return {
    tiers: over.withPro === false ? tiers.filter((x) => x.tier !== 'pro') : tiers,
    premiumPurchasable: true,
    premiumPriceUSD: 9,
    premiumPriceYearlyUSD: 90,
    proPurchasable: over.proPurchasable ?? true,
    proPriceUSD: 17,
    proPriceYearlyUSD: 170,
  };
}
