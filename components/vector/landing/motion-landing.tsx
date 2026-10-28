/**
 * Server-rendered parts of the `/tools/motion` page (ticket MM48 decision 1):
 * the quick-start guide and the plan table. Both land in the prerendered HTML
 * (crawlable in view-source); the only client island is the launcher.
 *
 * The plan table is built from the public `GET /api/tiers` body by
 * `lib/vector/planTable.ts`, so there is no numeric literal here: a retuned
 * allowance, a format added to a tier or MM49's Pro row show up on the next
 * revalidation with no code change (decisions 1 and 10).
 */
import Link from 'next/link';
import { Check, Info, Minus } from 'lucide-react';

import { localizeHref } from '@/i18n/locales';
import { getServerT, ServerTrans } from '@/lib/i18n/server';
import type { TiersResponse } from '@/lib/auth/accountApi';
import { MOTION_BRAND } from '@/lib/vector/brand';
import { buildPlanTable, type PlanTable, type RasterCap } from '@/lib/vector/planTable';
import { cn } from '@/lib/utils';

type T = ReturnType<typeof getServerT>;
const brand = { values: { brand: MOTION_BRAND } };
const K = 'motionPage';

/** The four-step guide under the intro (a native <details>, open, like Darkroom's). */
export function MotionGuide({ locale }: { locale: string }) {
  const t = getServerT('interface', locale);
  return (
    <details className="my-4 rounded-lg border border-primary/30 bg-primary/8" open data-testid="motion-guide">
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
            <li>{t(`${K}.guide.step1`)}</li>
            <li>{t(`${K}.guide.step2`)}</li>
            <li>{t(`${K}.guide.step3`)}</li>
            <li>{t(`${K}.guide.step4`)}</li>
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

const count = (n: number, t: T) => (n < 0 ? t(`${K}.plans.values.unlimited`) : `${n}`);

function rasterCapText(cap: RasterCap, t: T): string {
  if (!cap) return t(`${K}.plans.values.notApplicable`);
  const parts = [
    cap.maxHeight > 0 ? t(`${K}.plans.values.capHeight`, { values: { height: cap.maxHeight } }) : '',
    cap.maxFps > 0 ? t(`${K}.plans.values.capFps`, { values: { fps: cap.maxFps } }) : '',
    cap.maxSeconds > 0 ? t(`${K}.plans.values.capSeconds`, { values: { seconds: cap.maxSeconds } }) : '',
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : t(`${K}.plans.values.noCap`);
}

function Mark({ on, t }: { on: boolean; t: T }) {
  return on ? (
    <span className="inline-flex items-center gap-1 text-sm text-success" data-included="true">
      <Check className="size-4" aria-hidden="true" />
      <span className="sr-only">{t(`${K}.plans.values.included`)}</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground" data-included="false">
      <Minus className="size-4" aria-hidden="true" />
      <span className="sr-only">{t(`${K}.plans.values.notIncluded`)}</span>
    </span>
  );
}

function PlanTableView({ table, t }: { table: PlanTable; t: T }) {
  const cols = table.columns;
  const th = 'py-3 pe-4 text-start text-xs font-medium uppercase tracking-wide text-muted-foreground';
  const rowTh = 'py-3 pe-4 text-start text-sm font-normal text-muted-foreground';
  const numeric = (rows: string[]) =>
    rows.map((v, i) => (
      <td key={cols[i].tier} className="num py-3 pe-4 text-sm text-foreground" data-tier={cols[i].tier}>
        {v}
      </td>
    ));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-start" data-testid="motion-plan-table">
        <caption className="sr-only">{t(`${K}.plans.caption`, brand)}</caption>
        <thead>
          <tr className="border-b border-edge-strong">
            <th scope="col" className={cn(th, 'w-1/3')}>
              {t(`${K}.plans.format`)}
            </th>
            {cols.map((c) => (
              <th key={c.tier} scope="col" className={th} data-tier={c.tier}>
                <span className="flex flex-wrap items-center gap-2">
                  {t(`pricing.tier.${c.tier}`)}
                  {c.tier === 'pro' ? (
                    <span className="rounded-full bg-premium/15 px-2 py-0.5 text-[11px] font-medium normal-case tracking-normal text-premium" data-testid="motion-pro-chip">
                      {t('pricing.proBadge')}
                    </span>
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-edge">
            <th scope="row" className={rowTh}>
              {t(`${K}.plans.staticSvg`)}
            </th>
            <td colSpan={cols.length} className="py-3 pe-4 text-sm text-foreground" data-row="svg_static">
              {t(`${K}.plans.staticFree`)}
            </td>
          </tr>
          {table.formats.map((row) => (
            <tr key={row.format} className="border-b border-edge" data-row={row.format}>
              <th scope="row" className={rowTh}>
                {t(`${K}.plans.formats.${row.format}`)}
              </th>
              {row.onNoPlan ? (
                <td colSpan={cols.length} className="py-3 pe-4 text-sm text-muted-foreground" data-coming-soon="true">
                  {t(`${K}.plans.values.comingSoon`)}
                </td>
              ) : (
                row.included.map((on, i) => (
                  <td key={cols[i].tier} className="py-3 pe-4" data-tier={cols[i].tier}>
                    <Mark on={on} t={t} />
                  </td>
                ))
              )}
            </tr>
          ))}
          <tr className="border-b border-edge" data-row="exportsPerDay">
            <th scope="row" className={rowTh}>
              {t(`${K}.plans.rows.exportsPerDay`)}
            </th>
            {numeric(table.exportsPerDay.map((n) => count(n, t)))}
          </tr>
          <tr className="border-b border-edge" data-row="projects">
            <th scope="row" className={rowTh}>
              {t(`${K}.plans.rows.projects`)}
            </th>
            {numeric(
              table.projects.map((n, i) =>
                cols[i].tier === 'anonymous' && n > 0
                  ? t(`${K}.plans.values.localOnly`, { values: { count: n } })
                  : count(n, t),
              ),
            )}
          </tr>
          <tr className="border-b border-edge" data-row="maxDuration">
            <th scope="row" className={rowTh}>
              {t(`${K}.plans.rows.maxDuration`)}
            </th>
            {numeric(
              table.maxDurationSeconds.map((s) =>
                s > 0 ? t(`${K}.plans.values.capSeconds`, { values: { seconds: s } }) : t(`${K}.plans.values.noCap`),
              ),
            )}
          </tr>
          <tr className="last:border-0" data-row="rasterCap">
            <th scope="row" className={rowTh}>
              {t(`${K}.plans.rows.rasterCap`)}
            </th>
            {numeric(table.rasterCap.map((cap) => rasterCapText(cap, t)))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/** The plan section. `data` is the served /api/tiers body, or null when it could not be loaded. */
export function MotionPlans({ data, locale }: { data: TiersResponse | null; locale: string }) {
  const t = getServerT('interface', locale);
  const table = buildPlanTable(data);
  const hasComingSoon = !!table?.formats.some((f) => f.onNoPlan);
  return (
    <section className="mt-12" aria-labelledby="motion-plans-heading" data-testid="motion-plans">
      <h2 id="motion-plans-heading" className="mb-4 border-b border-edge pb-2 text-xl font-semibold tracking-tight text-card-foreground">
        {t(`${K}.plans.title`)}
      </h2>
      <p className="mb-4 max-w-3xl text-sm text-muted-foreground">{t(`${K}.plans.intro`, brand)}</p>
      {table ? (
        <>
          <PlanTableView table={table} t={t} />
          {hasComingSoon ? (
            <p className="mt-3 text-sm text-muted-foreground" data-testid="motion-coming-soon-note">
              {/* MM85: "available on request", with the contact page as the way to ask. */}
              <ServerTrans
                locale={locale}
                i18nKey={`interface:${K}.plans.comingSoonNote`}
                components={{
                  linkContact: (
                    <Link
                      href={localizeHref('/contact', locale)}
                      className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                    />
                  ),
                }}
              />
            </p>
          ) : null}
          <p className="mt-3 text-sm text-muted-foreground">{t(`${K}.plans.resetNote`)}</p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground" data-testid="motion-plans-unavailable">
          {t(`${K}.plans.unavailable`)}
        </p>
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
