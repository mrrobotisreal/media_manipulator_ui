// The pricing comparison. A React Server Component: every number is fetched at
// build/revalidate time from GET /api/tiers and lands in the prerendered HTML,
// so a crawler reads the real matrix and the browser downloads no extra JS for
// this page at all.
//
// Nothing here is a literal. internal/tiers/tiers.go, fed by TIER_* config, is
// the single source of truth; a table of hard-coded numbers would be a second
// one that silently disagrees the first time a limit is retuned.

import Link from 'next/link';

import { getServerT } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';
import { Panel } from '@/components/darkroom/panel';
import { PricingTracker, PricingUpgradeLink } from '@/components/pricing/pricing-tracker';
import {
  CheckoutCancelledNote,
  PlanPricing,
  PricingIntervalToggle,
  type PlanPricingLabels,
} from '@/components/pricing/premium-cta';
import { CurrencyToggle } from '@/components/pricing/currency-toggle';
import type { BillingCurrency, PaidPlan, TierDescriptor, TierLimits, TiersResponse } from '@/lib/auth/accountApi';
import { formatBytes, formatDuration } from '@/lib/auth/formatLimits';
import { planPrices, yearlyMonthsFree } from '@/lib/billing/price';
import { cn } from '@/lib/utils';

type T = ReturnType<typeof getServerT>;

/** Ordered so the table reads left-to-right as increasing capability. */
const TIER_ORDER = ['anonymous', 'free', 'premium', 'pro'] as const;
type TierKey = (typeof TIER_ORDER)[number];

/**
 * The panels above the table (MM40: Free · Premium · Pro). The anonymous tier is the first
 * column of the comparison table and a slim strip above the panels, not a fourth panel.
 */
const PANEL_ORDER = ['free', 'premium', 'pro'] as const;

const isPaid = (tier: TierKey): tier is PaidPlan => tier === 'premium' || tier === 'pro';

interface Row {
  key: string;
  render: (limits: TierLimits, t: T, tier: TierKey) => React.ReactNode;
  /** Present only when every served tier carries the field (older APIs omit Motion). */
  served?: (limits: TierLimits) => boolean;
}

const count = (n: number, t: T) => (n < 0 ? t('interface:pricing.values.unlimited') : `${n}`);

/**
 * One row per matrix line. `render` returns a string for measured values and a
 * marked-up node for the yes/no lines, so a boolean never renders as the word
 * "true" and a number never loses its tabular alignment.
 */
const ROWS: Row[] = [
  {
    key: 'opsPerDay',
    render: (l, t) => (l.opsPerDay < 0 ? t('interface:pricing.values.unlimited') : `${l.opsPerDay}`),
  },
  {
    key: 'aiOpsPerDay',
    render: (l, t) => (l.aiOpsPerDay < 0 ? t('interface:pricing.values.unlimited') : `${l.aiOpsPerDay}`),
  },
  { key: 'exportsPerDay', render: (l, t) => count(l.exportsPerDay, t) },
  { key: 'maxFileBytes', render: (l) => formatBytes(l.maxFileBytes) },
  { key: 'maxVideoSeconds', render: (l) => formatDuration(l.maxVideoSeconds) },
  {
    key: 'maxOutputHeight',
    render: (l, t) => t('interface:pricing.values.heightSuffix', { values: { height: l.maxOutputHeight } }),
  },
  {
    key: 'studioProjects',
    render: (l, t) =>
      l.studioProjects < 0
        ? t('interface:pricing.values.unlimited')
        : `${l.studioProjects}`,
  },
  {
    key: 'vectorExportsPerDay',
    render: (l, t) => count(l.vectorExportsPerDay ?? 0, t),
    served: (l) => typeof l.vectorExportsPerDay === 'number',
  },
  {
    key: 'vectorProjects',
    // The anonymous allowance lives in the browser only (the server never stores it).
    render: (l, t, tier) =>
      tier === 'anonymous' && (l.vectorProjects ?? 0) > 0
        ? t('interface:pricing.values.localOnly', { values: { count: l.vectorProjects ?? 0 } })
        : count(l.vectorProjects ?? 0, t),
    served: (l) => typeof l.vectorProjects === 'number',
  },
  {
    key: 'priorityGpu',
    render: (l, t) =>
      l.priorityGpu
        ? t('interface:pricing.values.gpuPriority')
        : t('interface:pricing.values.gpuStandard'),
  },
  {
    key: 'adsRemoved',
    render: (l, t) =>
      l.adsRemoved
        ? t('interface:pricing.values.adsRemoved')
        : t('interface:pricing.values.adsShown'),
  },
];

/** The value cell. Measured numbers are monospace; prose is not. */
const ValueCell: React.FC<{ children: React.ReactNode; numeric: boolean }> = ({
  children,
  numeric,
}) => (
  <span className={cn('text-sm text-foreground', numeric && 'num')}>{children}</span>
);

const NUMERIC_ROWS = new Set([
  'opsPerDay',
  'aiOpsPerDay',
  'exportsPerDay',
  'vectorExportsPerDay',
  'vectorProjects',
  'maxFileBytes',
  'maxVideoSeconds',
  'maxOutputHeight',
  'studioProjects',
]);

const CURRENCIES: readonly BillingCurrency[] = ['usd', 'eur'];

/** A plan's served numerals per currency (MM69), for the column island to format. */
function planPricesByCurrency(data: TiersResponse, plan: PaidPlan) {
  return Object.fromEntries(CURRENCIES.map((c) => [c, planPrices(data, plan, c)])) as Record<
    BillingCurrency,
    { monthly: number | undefined; yearly: number | undefined }
  >;
}

function planLabels(t: T, data: TiersResponse, plan: PaidPlan): PlanPricingLabels {
  const { monthly, yearly } = planPrices(data, plan);
  // "N months free" is derived from the two served prices, never hard-coded (same numerals
  // in both currencies, so either one gives the same figure).
  const months = yearlyMonthsFree(monthly, yearly);
  return {
    perMonth: t('interface:billing.perMonth'),
    perYear: t('interface:billing.perYear'),
    yearlyBonus: months >= 1 ? t('interface:billing.yearlyBonus', { values: { months } }) : '',
    blurb: t(`interface:pricing.tierBlurb.${plan}`),
    cancelAnytime: t('interface:billing.cancelAnytime'),
    refund: t('interface:billing.refund'),
    taxNote: t('interface:billing.taxNote'),
    ctaUpgrade: t(plan === 'pro' ? 'interface:billing.upgradePro' : 'interface:billing.upgrade'),
    ctaManage: t('interface:billing.manage'),
    ctaOperator: t('interface:billing.operator'),
    ctaUnavailable: t(plan === 'pro' ? 'interface:billing.unavailablePro' : 'interface:billing.unavailable'),
    ctaBusy: t('interface:billing.busy'),
    currentPlan: t('interface:pricing.currentPlan'),
    ctaChangeUp: t('interface:billing.upgradePro'),
    ctaChangeDown: t('interface:billing.switchToPremium'),
    pendingFrom: t('interface:pricing.pendingFrom'),
  };
}

const TierHeader: React.FC<{
  tier: TierKey;
  t: T;
  data: TiersResponse;
  locale: string;
}> = ({ tier, t, data, locale }) => {
  if (isPaid(tier)) {
    const purchasable = tier === 'pro' ? data.proPurchasable === true : data.premiumPurchasable;
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold tracking-[-0.02em] text-premium">
            {t(`interface:pricing.tier.${tier}`)}
          </h2>
          {tier === 'pro' ? (
            <span className="rounded-full bg-premium/15 px-2 py-0.5 text-xs font-medium text-premium" data-testid="pro-badge">
              {t('interface:pricing.proBadge')}
            </span>
          ) : null}
        </div>
        {/* Price, CTA and plan state live in one client island per column so the page stays a
            server component and the matrix stays in the prerendered HTML. */}
        <PlanPricing
          plan={tier}
          labels={planLabels(t, data, tier)}
          purchasable={purchasable}
          prices={planPricesByCurrency(data, tier)}
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-base font-semibold tracking-[-0.02em] text-foreground">
        {t(`interface:pricing.tier.${tier}`)}
      </h2>
      <p className="num text-2xl leading-none text-foreground">
        {t('interface:pricing.free_price')}
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {t(`interface:pricing.tierBlurb.${tier}`)}
      </p>
      {tier === 'free' ? (
        // The one genuine upgrade CTA on this page: /account's signed-out state IS the
        // sign-up panel, so clicking this is a visitor deciding to create an account after
        // reading the comparison. Worth the client island (see pricing-tracker.tsx).
        <PricingUpgradeLink
          href={localizeHref('/account', locale)}
          ctaId="pricing_free_tier"
          className="mt-1 inline-flex w-fit items-center text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          {t('interface:pricing.cta.free')}
        </PricingUpgradeLink>
      ) : (
        <Link
          // Anonymous: straight into the tools, which is the whole promise of the tier —
          // navigation, not an upgrade, so it stays a plain server-rendered link with no
          // client JS and no upgrade event.
          href={localizeHref('/tools', locale)}
          className="mt-1 inline-flex w-fit items-center text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          {t(`interface:pricing.cta.${tier}`)}
        </Link>
      )}
    </div>
  );
};

const RowList: React.FC<{ rows: Row[]; column: TierDescriptor; t: T }> = ({ rows, column, t }) => (
  <dl className="mt-5 grid gap-2 md:hidden">
    {rows.map((row) => (
      <div
        key={row.key}
        className="flex items-baseline justify-between gap-4 border-b border-edge pb-2 last:border-0 last:pb-0"
      >
        <dt className="text-sm text-muted-foreground">{t(`interface:pricing.rows.${row.key}`)}</dt>
        <dd className="text-end">
          <ValueCell numeric={NUMERIC_ROWS.has(row.key)}>
            {row.render(column.limits, t, column.tier as TierKey)}
          </ValueCell>
        </dd>
      </div>
    ))}
  </dl>
);

export const PricingUnavailable: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';
  return (
    <Panel className="mx-auto max-w-2xl text-center">
      <h2 className="text-lg font-semibold text-foreground">
        {t('interface:pricing.unavailableTitle')}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t('interface:pricing.unavailableBody')}
      </p>
      <Link
        href={localizeHref('/tools', loc)}
        className="mt-4 inline-flex text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
      >
        {t('interface:pricing.cta.anonymous')}
      </Link>
    </Panel>
  );
};

export const PricingView: React.FC<{ data: TiersResponse; locale?: string }> = ({ data, locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';
  const byTier = new Map<string, TierDescriptor>(
    data.tiers.map((entry) => [entry.tier, entry]),
  );
  const columns = TIER_ORDER.map((tier) => byTier.get(tier)).filter(
    (entry): entry is TierDescriptor => Boolean(entry),
  );
  const panels = PANEL_ORDER.map((tier) => byTier.get(tier)).filter(
    (entry): entry is TierDescriptor => Boolean(entry),
  );
  const anonymous = byTier.get('anonymous');
  const rows = ROWS.filter((row) => !row.served || columns.every((c) => row.served!(c.limits)));
  const hasMotion = rows.some((row) => row.key.startsWith('vector'));
  // The toggle shows when any paid column has a yearly price to switch to.
  const hasYearly = panels.some((c) => isPaid(c.tier as TierKey) && typeof planPrices(data, c.tier as PaidPlan).yearly === 'number');

  return (
    <div className="container mx-auto max-w-[1100px] px-4 py-12 md:py-16">
      {/* Renders nothing; emits pricing_viewed once. */}
      <PricingTracker />
      <CheckoutCancelledNote
        message={t('interface:billing.cancelledNote')}
        dismiss={t('interface:billing.dismiss')}
      />
      <header className="mb-10 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-data">
          {t('interface:pricing.eyebrow')}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
          {t('interface:pricing.title')}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {t('interface:pricing.subtitle')}
        </p>
      </header>

      {/* One interval for both paid columns, and the USD / EUR toggle beside it (MM69; it
          renders nothing until the browser's /api/tiers answer says EUR is sold). */}
      <div className="mb-6 flex flex-wrap items-center gap-3" data-testid="pricing-toggles">
        {hasYearly ? (
          <PricingIntervalToggle
            label={t('interface:billing.intervalLabel')}
            monthly={t('interface:billing.monthly')}
            yearly={t('interface:billing.yearly')}
          />
        ) : null}
        <CurrencyToggle placement="pricing" />
      </div>

      {anonymous ? (
        // The no-account tier: a slim strip rather than a fourth panel (MM40), with its full
        // row list below md, where the comparison table is hidden.
        <Panel className="mb-6" data-testid="pricing-anonymous">
          <TierHeader tier="anonymous" t={t} data={data} locale={loc} />
          <RowList rows={rows} column={anonymous} t={t} />
        </Panel>
      ) : null}

      {/* One panel per paid-or-free tier. Below md it carries the full row list, so the
          comparison is readable on a phone without a sideways-scrolling table; from md up
          the list collapses and the aligned table below takes over. */}
      <div className="grid gap-6 md:grid-cols-3">
        {panels.map((column) => (
          <Panel
            key={column.tier}
            className={cn(isPaid(column.tier as TierKey) && 'border-premium/30')}
            data-testid={`pricing-panel-${column.tier}`}
          >
            <TierHeader
              tier={column.tier as TierKey}
              t={t}
              data={data}
              locale={loc}
            />
            <RowList rows={rows} column={column} t={t} />
          </Panel>
        ))}
      </div>

      {/* md+: the values aligned in columns, which is what makes a comparison
          a comparison rather than four lists side by side. */}
      <div className="mt-10 hidden md:block">
        <table className="w-full border-collapse text-start" data-testid="pricing-table">
          <caption className="sr-only">{t('interface:pricing.title')}</caption>
          <thead>
            <tr className="border-b border-edge-strong">
              <th
                scope="col"
                className="w-1/3 py-3 pe-4 text-start text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                {t('interface:pricing.eyebrow')}
              </th>
              {columns.map((column) => (
                <th
                  key={column.tier}
                  scope="col"
                  className="py-3 pe-4 text-start text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {t(`interface:pricing.tier.${column.tier}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-edge last:border-0">
                <th
                  scope="row"
                  className="py-3 pe-4 text-start text-sm font-normal text-muted-foreground"
                >
                  {t(`interface:pricing.rows.${row.key}`)}
                </th>
                {columns.map((column) => (
                  <td key={column.tier} className="py-3 pe-4" data-tier={column.tier} data-row={row.key}>
                    <ValueCell numeric={NUMERIC_ROWS.has(row.key)}>
                      {row.render(column.limits, t, column.tier as TierKey)}
                    </ValueCell>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMotion ? (
        <p data-testid="pricing-motion-note" className="mt-4 text-sm text-muted-foreground">
          {t('interface:pricing.motionNote')}
        </p>
      ) : null}
      <p data-testid="pricing-retention-note" className="mt-4 text-sm text-muted-foreground">
        {t('interface:pricing.retentionNote')}
      </p>

      <section className="mt-14 max-w-2xl">
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
          {t('interface:pricing.faqTitle')}
        </h2>
        <dl className="mt-5 grid gap-5">
          {(['1', '2', '3', '4'] as const).map((n) => (
            <div key={n}>
              <dt className="text-sm font-medium text-foreground">
                {t(`interface:pricing.faq.q${n}`)}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t(`interface:pricing.faq.a${n}`)}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
};

export default PricingView;
