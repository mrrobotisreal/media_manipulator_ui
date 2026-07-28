// The pricing comparison. A React Server Component: every number is fetched at
// build/revalidate time from GET /api/tiers and lands in the prerendered HTML,
// so a crawler reads the real matrix and the browser downloads no extra JS for
// this page at all.
//
// Nothing here is a literal. internal/tiers/tiers.go, fed by TIER_* config, is
// the single source of truth; a table of hard-coded numbers would be a second
// one that silently disagrees the first time a limit is retuned.

import Link from 'next/link';
import { Check, Minus } from 'lucide-react';

import { getServerT } from '@/lib/i18n/server';
import { Panel } from '@/components/darkroom/panel';
import type { TierDescriptor, TierLimits, TiersResponse } from '@/lib/auth/accountApi';
import {
  formatBytes,
  formatDuration,
  formatRetention,
} from '@/lib/auth/formatLimits';
import { cn } from '@/lib/utils';

type T = ReturnType<typeof getServerT>;

/** Ordered so the table reads left-to-right as increasing capability. */
const TIER_ORDER = ['anonymous', 'free', 'premium'] as const;
type TierKey = (typeof TIER_ORDER)[number];

interface Row {
  key: string;
  render: (limits: TierLimits, t: T) => React.ReactNode;
}

/**
 * One row per matrix line. `render` returns a string for measured values and a
 * marked-up node for the yes/no lines, so a boolean never renders as the word
 * "true" and a number never loses its tabular alignment.
 */
const ROWS: Row[] = [
  { key: 'opsPerDay', render: (l) => `${l.opsPerDay}` },
  { key: 'aiOpsPerDay', render: (l) => `${l.aiOpsPerDay}` },
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
  { key: 'resultRetentionHours', render: (l) => formatRetention(l.resultRetentionHours) },
  { key: 'batchEnabled', render: (l, t) => <BoolCell on={l.batchEnabled} t={t} /> },
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

const BoolCell: React.FC<{ on: boolean; t: T }> = ({ on, t }) =>
  on ? (
    <span className="inline-flex items-center gap-1.5 text-data">
      <Check aria-hidden="true" className="size-3.5" />
      <span className="sr-only">{t('interface:pricing.values.yes')}</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-text-subtle">
      <Minus aria-hidden="true" className="size-3.5" />
      <span className="sr-only">{t('interface:pricing.values.no')}</span>
    </span>
  );

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
  'maxFileBytes',
  'maxVideoSeconds',
  'maxOutputHeight',
  'studioProjects',
  'resultRetentionHours',
]);

const TierHeader: React.FC<{
  tier: TierKey;
  t: T;
  price?: number;
  purchasable?: boolean;
}> = ({ tier, t, price, purchasable }) => {
  const isPremium = tier === 'premium';
  return (
    <div className="flex flex-col gap-2">
      <h2
        className={cn(
          'text-base font-semibold tracking-[-0.02em]',
          isPremium ? 'text-premium' : 'text-foreground',
        )}
      >
        {t(`interface:pricing.tier.${tier}`)}
      </h2>
      <p className="num text-2xl leading-none text-foreground">
        {isPremium && price !== undefined ? (
          <>
            ${price}
            <span className="text-sm text-muted-foreground">
              {t('interface:pricing.perMonth')}
            </span>
          </>
        ) : (
          t('interface:pricing.free_price')
        )}
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {t(`interface:pricing.tierBlurb.${tier}`)}
      </p>
      {isPremium ? (
        <span
          className={cn(
            'mt-1 inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs',
            purchasable
              ? 'border-premium/40 text-premium'
              : 'border-edge text-muted-foreground',
          )}
        >
          {purchasable
            ? t('interface:pricing.cta.premiumBuy')
            : t('interface:pricing.cta.premiumSoon')}
        </span>
      ) : (
        <Link
          // Anonymous: straight into the tools, which is the whole promise of
          // the tier. Free: /account, whose signed-out state is the sign-in
          // panel — this page stays a server component with no client JS.
          href={tier === 'free' ? '/account' : '/tools'}
          className="mt-1 inline-flex w-fit items-center text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          {t(`interface:pricing.cta.${tier}`)}
        </Link>
      )}
    </div>
  );
};

export const PricingUnavailable: React.FC = () => {
  const t = getServerT();
  return (
    <Panel className="mx-auto max-w-2xl text-center">
      <h2 className="text-lg font-semibold text-foreground">
        {t('interface:pricing.unavailableTitle')}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t('interface:pricing.unavailableBody')}
      </p>
      <Link
        href="/tools"
        className="mt-4 inline-flex text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
      >
        {t('interface:pricing.cta.anonymous')}
      </Link>
    </Panel>
  );
};

export const PricingView: React.FC<{ data: TiersResponse }> = ({ data }) => {
  const t = getServerT();
  const byTier = new Map<string, TierDescriptor>(
    data.tiers.map((entry) => [entry.tier, entry]),
  );
  const columns = TIER_ORDER.map((tier) => byTier.get(tier)).filter(
    (entry): entry is TierDescriptor => Boolean(entry),
  );

  return (
    <div className="container mx-auto max-w-[1100px] px-4 py-12 md:py-16">
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

      {/* One panel per tier. Below md it carries the full row list, so the
          comparison is readable on a phone without a sideways-scrolling table;
          from md up the list collapses and the aligned table below takes over.
          Each tier is headed exactly once either way. */}
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <Panel
            key={column.tier}
            className={cn(column.tier === 'premium' && 'border-premium/30')}
          >
            <TierHeader
              tier={column.tier as TierKey}
              t={t}
              price={data.premiumPriceUSD}
              purchasable={data.premiumPurchasable}
            />
            <dl className="mt-5 grid gap-2 md:hidden">
              {ROWS.map((row) => (
                <div
                  key={row.key}
                  className="flex items-baseline justify-between gap-4 border-b border-edge pb-2 last:border-0 last:pb-0"
                >
                  <dt className="text-sm text-muted-foreground">
                    {t(`interface:pricing.rows.${row.key}`)}
                  </dt>
                  <dd className="text-right">
                    <ValueCell numeric={NUMERIC_ROWS.has(row.key)}>
                      {row.render(column.limits, t)}
                    </ValueCell>
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
        ))}
      </div>

      {/* md+: the values aligned in columns, which is what makes a comparison
          a comparison rather than three lists side by side. */}
      <div className="mt-10 hidden md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{t('interface:pricing.title')}</caption>
          <thead>
            <tr className="border-b border-edge-strong">
              <th
                scope="col"
                className="w-2/5 py-3 pr-4 text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                {t('interface:pricing.eyebrow')}
              </th>
              {columns.map((column) => (
                <th
                  key={column.tier}
                  scope="col"
                  className="py-3 pr-4 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {t(`interface:pricing.tier.${column.tier}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key} className="border-b border-edge last:border-0">
                <th
                  scope="row"
                  className="py-3 pr-4 text-sm font-normal text-muted-foreground"
                >
                  {t(`interface:pricing.rows.${row.key}`)}
                </th>
                {columns.map((column) => (
                  <td key={column.tier} className="py-3 pr-4">
                    <ValueCell numeric={NUMERIC_ROWS.has(row.key)}>
                      {row.render(column.limits, t)}
                    </ValueCell>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
