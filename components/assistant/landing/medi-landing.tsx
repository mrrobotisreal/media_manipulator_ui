/**
 * Server-rendered parts of the `/tools/medi` page (MM111): the four-step guide and the plan table, both in the
 * prerendered HTML. No client island and no ad slot. The plan table has no numeric literal: the copilot row
 * follows `GET /api/tiers` (`assistantTurns`).
 */
import Link from 'next/link';
import { Info } from 'lucide-react';

import { localizeHref } from '@/i18n/locales';
import { getServerT } from '@/lib/i18n/server';
import type { TierLimits, TiersResponse } from '@/lib/auth/accountApi';
import { MEDI_BRAND } from '@/lib/assistant/brand';
import { EDITOR_LINKS } from './links';

type T = ReturnType<typeof getServerT>;
const brand = { values: { brand: MEDI_BRAND } };
const K = 'mediPage';

export const MEDI_PLAN_TIERS = ['anonymous', 'free', 'premium', 'pro'] as const;

export interface MediPlanTable {
  columns: Array<{ tier: (typeof MEDI_PLAN_TIERS)[number]; turns: number }>;
}

/** The table, or null when the API is unreachable or predates Medi's `assistantTurns` field. */
export function buildMediPlanTable(data: TiersResponse | null | undefined): MediPlanTable | null {
  if (!data || !Array.isArray(data.tiers)) return null;
  const byTier = new Map(data.tiers.map((d) => [d.tier as string, d.limits as TierLimits]));
  const columns: MediPlanTable['columns'] = [];
  for (const tier of MEDI_PLAN_TIERS) {
    const l = byTier.get(tier);
    if (l && typeof l.assistantTurns === 'number') columns.push({ tier, turns: l.assistantTurns });
  }
  return columns.length ? { columns } : null;
}

export function MediGuide({ locale }: { locale: string }) {
  const t = getServerT('interface', locale);
  return (
    <details className="my-4 rounded-lg border border-primary/30 bg-primary/8" open data-testid="medi-page-guide">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 font-semibold text-card-foreground">
        <Info className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 className="text-base font-semibold">{t(`${K}.guide.summaryTitle`, brand)}</h2>
      </summary>
      <div className="space-y-4 px-4 pb-4 text-sm text-muted-foreground">
        <div>
          <h3 className="font-medium text-card-foreground">{t(`${K}.guide.whatItIsTitle`)}</h3>
          <p>{t(`${K}.guide.whatItIsBody`, brand)}</p>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">{t(`${K}.guide.stepsTitle`)}</h3>
          <ol className="mt-1 list-decimal space-y-1 ps-5">
            {[1, 2, 3, 4].map((n) => (
              <li key={n}>{t(`${K}.guide.step${n}`, brand)}</li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="font-medium text-card-foreground">{t(`${K}.guide.editorTitle`)}</h3>
          <p>{t(`${K}.guide.editorBody`, brand)}</p>
        </div>
      </div>
    </details>
  );
}

/** Replaces the generic upload panel: Medi has nothing to upload on this page. */
export function MediTryPanel({ locale }: { locale: string }) {
  const t = getServerT('interface', locale);
  return (
    <section className="my-6 rounded-lg border border-edge bg-surface-1 p-4" data-testid="medi-page-try">
      <h2 className="text-lg font-semibold text-card-foreground">{t(`${K}.panel.title`)}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t(`${K}.panel.body`, brand)}</p>
      <p className="mt-3 text-sm text-muted-foreground">{t(`${K}.panel.editors`)}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-sm">
        {EDITOR_LINKS.map((e) => (
          <Link
            key={e.href}
            href={localizeHref(e.href, locale)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-card-foreground transition-colors hover:bg-muted"
          >
            {e.brand}
          </Link>
        ))}
      </div>
    </section>
  );
}

const cellFor = (turns: number, t: T) =>
  turns < 0 ? t(`${K}.plans.values.unlimited`) : turns === 0 ? t(`${K}.plans.values.signIn`) : `${turns}`;

export function MediPlans({ data, locale }: { data: TiersResponse | null; locale: string }) {
  const t = getServerT('interface', locale);
  const table = buildMediPlanTable(data);
  const th = 'py-3 pe-4 text-start text-xs font-medium uppercase tracking-wide text-muted-foreground';
  const rowTh = 'py-3 pe-4 text-start text-sm font-normal text-muted-foreground';
  return (
    <section className="mt-12" aria-labelledby="medi-plans-heading" data-testid="medi-plans">
      <h2 id="medi-plans-heading" className="mb-4 border-b border-edge pb-2 text-xl font-semibold tracking-tight text-card-foreground">
        {t(`${K}.plans.title`, brand)}
      </h2>
      <p className="mb-4 max-w-3xl text-sm text-muted-foreground">{t(`${K}.plans.intro`, brand)}</p>
      {table ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-start" data-testid="medi-plan-table">
              <caption className="sr-only">{t(`${K}.plans.caption`, brand)}</caption>
              <thead>
                <tr className="border-b border-edge-strong">
                  <th scope="col" className={`${th} w-1/3`}>{t(`${K}.plans.feature`)}</th>
                  {table.columns.map((c) => (
                    <th key={c.tier} scope="col" className={th} data-tier={c.tier}>{t(`pricing.tier.${c.tier}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-edge" data-row="guide">
                  <th scope="row" className={rowTh}>{t(`${K}.plans.rows.guide`)}</th>
                  {table.columns.map((c) => (
                    <td key={c.tier} className="py-3 pe-4 text-sm text-foreground" data-tier={c.tier}>{t(`${K}.plans.values.included`)}</td>
                  ))}
                </tr>
                <tr data-row="edits">
                  <th scope="row" className={rowTh}>{t(`${K}.plans.rows.edits`)}</th>
                  {table.columns.map((c) => (
                    <td key={c.tier} className="num py-3 pe-4 text-sm text-foreground" data-tier={c.tier}>{cellFor(c.turns, t)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t(`${K}.plans.costNote`)}</p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground" data-testid="medi-plans-unavailable">{t(`${K}.plans.unavailable`)}</p>
      )}
      <Link
        href={localizeHref('/pricing', locale)}
        className="mt-3 inline-flex text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
      >
        {t(`${K}.plans.seePlans`)}
      </Link>
    </section>
  );
}
