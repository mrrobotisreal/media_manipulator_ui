import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => ({ ...m.fakeLocalization(), formatTime: () => '12:00' }) };
});

import { StatusBody } from './status-view';
import { fetchSystemHealth, parseSystemHealth } from '@/lib/status/systemHealth';
import type { SystemHealth } from '@/lib/status/systemHealth';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const rich = (state: SystemHealth['state'], extra: Partial<SystemHealth> = {}): SystemHealth => ({
  state,
  basic: false,
  checks: { database: 'ok', storage: 'ok' },
  queue: { gpuEnabled: true, running: 2, waiting: 5 },
  ...extra,
});

describe('StatusBody', () => {
  it.each([['operational'], ['degraded'], ['down'], ['unknown']] as const)('renders the %s state in a polite live region', (state) => {
    render(<StatusBody health={rich(state)} />);
    const live = screen.getByTestId('status-live');
    expect(live.getAttribute('aria-live')).toBe('polite');
    expect(screen.getByTestId('status-state').textContent).toBe(`interface:status.${state}`);
    expect(live.textContent).toContain(`interface:status.${state}Detail`);
  });

  it('shows queue depth and failing checks when known', () => {
    render(<StatusBody health={rich('degraded', { checks: { database: 'fail', storage: 'ok' } })} />);
    expect(screen.getByTestId('status-running').textContent).toBe('2');
    expect(screen.getByTestId('status-waiting').textContent).toBe('5');
    expect(screen.getByTestId('status-check-database').textContent).toContain('interface:status.fail');
  });

  it('shows only the overall status when only basic health is known', () => {
    render(<StatusBody health={{ state: 'operational', basic: true }} />);
    expect(screen.getByTestId('status-basic')).toBeTruthy();
    expect(screen.queryByTestId('status-queue')).toBeNull();
    expect(screen.queryByTestId('status-check-database')).toBeNull();
  });

  it('an unreachable API is "status unavailable", never "down", and carries no basic-only note', () => {
    render(<StatusBody health={{ state: 'unknown', basic: true }} />);
    expect(screen.getByTestId('status-state').textContent).toBe('interface:status.unknown');
    expect(screen.getByTestId('status-live').textContent).toContain('interface:status.unknownDetail');
    expect(screen.getByTestId('status-live').textContent).not.toContain('interface:status.down');
    expect(screen.queryByTestId('status-basic')).toBeNull();
  });

  it('says the GPU is off instead of showing counts', () => {
    render(<StatusBody health={rich('operational', { queue: { gpuEnabled: false, running: 0, waiting: 0 } })} />);
    expect(screen.queryByTestId('status-running')).toBeNull();
    expect(screen.getByTestId('status-queue').textContent).toContain('interface:status.gpuOff');
  });

  it('shows a checking line before the first answer', () => {
    render(<StatusBody health={null} />);
    expect(screen.getByTestId('status-live').textContent).toBe('interface:status.checking');
  });
});

describe('fetchSystemHealth', () => {
  const reply = (status: number, body: unknown) => ({ status, json: async () => body }) as Response;

  it('uses /system/health when it exists', async () => {
    const f = vi.fn().mockResolvedValueOnce(
      reply(200, { status: 'degraded', checks: { database: 'fail', storage: 'ok' }, queue: { gpuEnabled: true, running: 1, waiting: 3 } }),
    );
    vi.stubGlobal('fetch', f);
    const h = await fetchSystemHealth();
    expect(f).toHaveBeenCalledTimes(1);
    expect(String(f.mock.calls[0][0])).toMatch(/\/system\/health$/);
    expect(h).toMatchObject({ state: 'degraded', basic: false, queue: { running: 1, waiting: 3 } });
  });

  it('falls back to /health on a 404 and reports only what is known', async () => {
    const f = vi
      .fn()
      .mockResolvedValueOnce(reply(404, { error: 'not found' }))
      .mockResolvedValueOnce(reply(200, { status: 'healthy', service: 'media_manipulator_api' }));
    vi.stubGlobal('fetch', f);
    const h = await fetchSystemHealth();
    expect(String(f.mock.calls[1][0])).toMatch(/\/health$/);
    expect(h).toEqual({ state: 'operational', basic: true });
  });

  it('a request that gets no answer (network error, CORS refusal) is unknown, not down', async () => {
    // What a browser throws when the API's CORS allow-list refuses the page's origin.
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    expect(await fetchSystemHealth()).toEqual({ state: 'unknown', basic: true });
  });

  it('reports down on a failing basic health', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(reply(404, null)).mockResolvedValueOnce(reply(503, null)));
    expect((await fetchSystemHealth()).state).toBe('down');
  });

  it('trusts a 503 /system/health body that says it is down', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(reply(503, { status: 'down' })));
    expect((await fetchSystemHealth()).state).toBe('down');
  });

  it('parseSystemHealth ignores junk', () => {
    expect(parseSystemHealth(null)).toBeNull();
    expect(parseSystemHealth({ status: 'weird' })?.state).toBe('down');
  });
});
