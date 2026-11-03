/**
 * Server-rendered parts of the `/tools/aperture` page (MM100 decision 3): the
 * four-step guide and the plan table, both in the prerendered HTML. The only
 * client island is the launcher. The plan table has no numeric literal: it follows
 * `GET /api/tiers` (lib/photo/planTable.ts).
 */
import Link from 'next/link';
import { Info } from 'lucide-react';

import { localizeHref } from '@/i18n/locales';
import { getServerT } from '@/lib/i18n/server';
import type { TiersResponse } from '@/lib/auth/accountApi';
import { PHOTO_BRAND } from '@/lib/photo/brand';
import { buildPhotoPlanTable, type PhotoPlanTable } from '@/lib/photo/planTable';

type T = ReturnType<typeof getServerT>;
const brand = { values: { brand: PHOTO_BRAND } };
const K = 'photoPage';

export function ApertureGuide({ locale }: { locale: string }) {
  const t = getServerT('interface', locale);
  return (
    <details className="my-4 rounded-lg border border-primary/30 bg-primary/8" open data-testid="photo-guide">
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

function PlanTableView({ table, t }: { table: PhotoPlanTable; t: T }) {
  const cols = table.columns;
  const th = 'py-3 pe-4 text-start text-xs font-medium uppercase tracking-wide text-muted-foreground';
  const rowTh = 'py-3 pe-4 text-start text-sm font-normal text-muted-foreground';
  const cells = (values: string[]) =>
    values.map((v, i) => (
      <td key={cols[i].tier} className="num py-3 pe-4 text-sm text-foreground" data-tier={cols[i].tier}>
        {v}
      </td>
    ));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-start" data-testid="photo-plan-table">
        <caption className="sr-only">{t(`${K}.plans.caption`, brand)}</caption>
        <thead>
          <tr className="border-b border-edge-strong">
            <th scope="col" className={`${th} w-1/3`}>
              {t(`${K}.plans.feature`)}
            </th>
            {cols.map((c) => (
              <th key={c.tier} scope="col" className={th} data-tier={c.tier}>
                {t(`pricing.tier.${c.tier}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-edge" data-row="projects">
            <th scope="row" className={rowTh}>
              {t(`${K}.plans.rows.projects`)}
            </th>
            {cells(
              table.projects.map((n, i) =>
                cols[i].tier === 'anonymous' && n === 0 ? t(`${K}.plans.values.localOnly`) : count(n, t),
              ),
            )}
          </tr>
          <tr className="border-b border-edge" data-row="maxMegapixels">
            <th scope="row" className={rowTh}>
              {t(`${K}.plans.rows.maxMegapixels`)}
            </th>
            {cells(table.maxMegapixels.map((n) => t(`${K}.plans.values.megapixels`, { values: { count: n } })))}
          </tr>
          <tr data-row="batch">
            <th scope="row" className={rowTh}>
              {t(`${K}.plans.rows.batch`)}
            </th>
            {cells(table.batch.map((n) => (n > 0 ? `${n}` : t(`${K}.plans.values.notAvailable`))))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/** The plan section. `data` is the served /api/tiers body, or null when it could not be loaded. */
export function AperturePlans({ data, locale }: { data: TiersResponse | null; locale: string }) {
  const t = getServerT('interface', locale);
  const table = buildPhotoPlanTable(data);
  return (
    <section className="mt-12" aria-labelledby="photo-plans-heading" data-testid="photo-plans">
      <h2 id="photo-plans-heading" className="mb-4 border-b border-edge pb-2 text-xl font-semibold tracking-tight text-card-foreground">
        {t(`${K}.plans.title`)}
      </h2>
      <p className="mb-4 max-w-3xl text-sm text-muted-foreground">{t(`${K}.plans.intro`, brand)}</p>
      {table ? (
        <>
          <PlanTableView table={table} t={t} />
          <p className="mt-3 text-sm text-muted-foreground">{t(`${K}.plans.costNote`)}</p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground" data-testid="photo-plans-unavailable">
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
