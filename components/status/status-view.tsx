'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Panel } from '@/components/darkroom/panel';
import { useLocalization } from '@/i18n/useLocalization';
import { fetchSystemHealth, type CheckResult, type ServiceState, type SystemHealth } from '@/lib/status/systemHealth';

export const STATUS_POLL_MS = 10_000;

const STATE_KEY: Record<ServiceState, string> = {
  operational: 'operational',
  degraded: 'degraded',
  down: 'down',
};

const STATE_DOT: Record<ServiceState, string> = {
  operational: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  down: 'bg-red-500',
};

/** Presentational: renders one known health snapshot. Exported for tests. */
export function StatusBody({ health, checkedAt }: { health: SystemHealth | null; checkedAt?: string }) {
  const { t } = useLocalization(['interface']);
  const s = (k: string, o?: Record<string, unknown>) => t(`interface:status.${k}`, o);
  const checkRows = health?.checks
    ? ([
        ['database', health.checks.database],
        ['storage', health.checks.storage],
        ['cache', health.checks.redis],
      ] as [string, CheckResult | undefined][]).filter(([, v]) => v !== undefined)
    : [];

  return (
    <>
      {/* aria-live so assistive tech hears a state change without a reload. */}
      <div aria-live="polite" role="status" data-testid="status-live">
        {health ? (
          <>
            <p className="flex items-center gap-3 text-2xl font-semibold text-card-foreground">
              <span aria-hidden="true" className={`inline-block h-3 w-3 rounded-full ${STATE_DOT[health.state]}`} />
              <span data-testid="status-state">{s(STATE_KEY[health.state])}</span>
            </p>
            <p className="mt-2 text-muted-foreground">{s(`${STATE_KEY[health.state]}Detail`)}</p>
          </>
        ) : (
          <p className="text-muted-foreground">{s('checking')}</p>
        )}
      </div>

      {health?.basic && health.state !== 'down' ? (
        <p className="mt-4 text-sm text-muted-foreground" data-testid="status-basic">
          {s('basicOnly')}
        </p>
      ) : null}

      {checkRows.length ? (
        <section className="mt-6" aria-labelledby="status-checks-h">
          <h2 id="status-checks-h" className="text-lg font-semibold text-card-foreground mb-2">
            {s('checksTitle')}
          </h2>
          <ul className="space-y-1">
            {checkRows.map(([name, v]) => (
              <li key={name} className="flex justify-between text-sm text-muted-foreground" data-testid={`status-check-${name}`}>
                <span>{s(name)}</span>
                <span>{s(v === 'ok' ? 'ok' : 'fail')}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {health?.queue ? (
        <section className="mt-6" aria-labelledby="status-queue-h" data-testid="status-queue">
          <h2 id="status-queue-h" className="text-lg font-semibold text-card-foreground mb-2">
            {s('queueTitle')}
          </h2>
          {health.queue.gpuEnabled ? (
            <ul className="space-y-1">
              <li className="flex justify-between text-sm text-muted-foreground">
                <span>{s('running')}</span>
                <span data-testid="status-running">{health.queue.running}</span>
              </li>
              <li className="flex justify-between text-sm text-muted-foreground">
                <span>{s('waiting')}</span>
                <span data-testid="status-waiting">{health.queue.waiting}</span>
              </li>
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{s('gpuOff')}</p>
          )}
        </section>
      ) : null}

      {checkedAt ? <p className="mt-6 text-xs text-muted-foreground">{s('lastChecked', { time: checkedAt })}</p> : null}
    </>
  );
}

export default function StatusView() {
  const { t, formatTime } = useLocalization(['interface']);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [checkedAt, setCheckedAt] = useState<string>();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const tick = useCallback(async (signal: AbortSignal) => {
    const next = await fetchSystemHealth(signal);
    if (signal.aborted) return;
    setHealth(next);
    setCheckedAt(formatTime(new Date()));
    timer.current = setTimeout(() => void tick(signal), STATUS_POLL_MS);
  }, [formatTime]);

  useEffect(() => {
    const ctl = new AbortController();
    void tick(ctl.signal);
    return () => {
      ctl.abort();
      clearTimeout(timer.current);
    };
  }, [tick]);

  return (
    <div className="px-4 sm:px-6">
      <Panel level="1" as="section" className="max-w-2xl mx-auto my-2">
        <h1 className="text-4xl font-bold mb-3 text-card-foreground">{t('interface:status.title')}</h1>
        <p className="text-muted-foreground mb-6">{t('interface:status.intro')}</p>
        <StatusBody health={health} checkedAt={checkedAt} />
      </Panel>
    </div>
  );
}
