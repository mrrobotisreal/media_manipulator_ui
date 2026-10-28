/**
 * MM88 decision 6: the in-content ad box exists only when ads can render. With ads off
 * (the review build) the frame renders nothing, so there is no 280px blank; with ads on it
 * reserves the box before the unit loads (no CLS). `ADSENSE_ENABLED` is a build-time
 * constant, so each case loads the module under its own environment.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function frameWith(env: Record<string, string>) {
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  vi.resetModules();
  const { AdSlotFrame } = await import('./ad-slot-frame');
  return render(
    <AdSlotFrame>
      <span data-testid="unit" />
    </AdSlotFrame>,
  ).container;
}

describe('MM88 AdSlotFrame', () => {
  it('renders nothing (no reserved box) with ads off', async () => {
    const box = await frameWith({ NODE_ENV: 'production', NEXT_PUBLIC_ADSENSE_ENABLED: '' });
    expect(box.innerHTML).toBe('');
  });

  it('reserves min-h-[280px] / md:min-h-[300px] with ads on in production', async () => {
    const box = await frameWith({ NODE_ENV: 'production', NEXT_PUBLIC_ADSENSE_ENABLED: 'true' });
    const frame = box.querySelector('[data-ad-frame]')!;
    expect(frame.className).toContain('min-h-[280px]');
    expect(frame.className).toContain('md:min-h-[300px]');
    expect(frame.querySelector('[data-testid="unit"]')).not.toBeNull();
  });

  it('stays off on a translator deployment even with the ad flag set', async () => {
    const box = await frameWith({
      NODE_ENV: 'production',
      NEXT_PUBLIC_ADSENSE_ENABLED: 'true',
      NEXT_PUBLIC_DEPLOY_ROLE: 'translator',
    });
    expect(box.innerHTML).toBe('');
  });

  it('keeps the box for the local MockAd preview (never production)', async () => {
    const box = await frameWith({ NODE_ENV: 'development', NEXT_PUBLIC_MOCK_ADS_ENABLED: 'true' });
    expect(box.querySelector('[data-ad-frame]')).not.toBeNull();
  });

  it('the tool landing page no longer reserves the box itself', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const src = readFileSync(join(__dirname, '../tools/tool-landing-page.tsx'), 'utf8');
    expect(src).not.toContain('min-h-[280px]');
    expect(src).toContain('<AdSlotFrame>');
  });
});
