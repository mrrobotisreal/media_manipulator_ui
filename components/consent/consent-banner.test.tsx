/**
 * MM88: the consent bar at phone width (375px) is at most 120px tall, and Accept and
 * Decline stay equal (same component, variant, size and classes).
 *
 * jsdom has no layout, so the height is computed from the base (below-`sm`) classes,
 * exactly as the comment in consent-banner.tsx does it:
 *
 *   border-t 1 + py-3 (12 + 12) + copy line-clamp-2 x leading-5 (2 x 20)
 *   + gap-2 8 + button row min-h-11 44  =  117px
 *
 * Every term is read from the rendered class names, so changing a class without
 * re-doing the budget fails here. Mitch verifies the real bar on a phone (ticket).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import { createI18nInstance } from '@/i18n';

const consent = vi.hoisted(() => ({ setConsent: vi.fn(), region: 'gdpr' }));
vi.mock('@/lib/consent', () => ({
  getConsentDetails: () => ({ regionGroup: consent.region }),
  setConsent: consent.setConsent,
}));
vi.mock('next/navigation', () => ({ usePathname: () => '/', useRouter: () => ({ push: vi.fn() }) }));

import { ConsentBanner, EQUAL_CHOICE } from './consent-banner';

afterEach(() => {
  cleanup();
  consent.setConsent.mockReset();
});

const SPACING_PX = 4;
/** The base (unprefixed) utilities of a class string, i.e. what applies below `sm`. */
const base = (cls: string) => cls.split(/\s+/).filter((c) => c && !c.includes(':'));
function num(cls: string, re: RegExp): number {
  const hit = base(cls).map((c) => re.exec(c)).find(Boolean);
  expect(hit, `${re} in "${cls}"`).toBeTruthy();
  return Number(hit![1]);
}

function renderBanner() {
  const onDecided = vi.fn();
  const onCustomize = vi.fn();
  render(
    <I18nextProvider i18n={createI18nInstance('en-US')}>
      <ConsentBanner onDecided={onDecided} onCustomize={onCustomize} />
    </I18nextProvider>,
  );
  return { onDecided, onCustomize };
}

describe('MM88 consent bar at 375px', () => {
  it('computes to <= 120px from its phone-width classes', () => {
    renderBanner();
    const region = screen.getByRole('region');
    const inner = region.firstElementChild as HTMLElement;
    const copy = region.querySelector('p')!;
    const buttonRow = screen.getByRole('button', { name: 'Accept' }).parentElement!;

    // The outer section: a 1px top border, nothing else vertical.
    expect(base(region.className)).toContain('border-t');
    const border = 1;
    // The inner column: vertical padding and the gap between copy and buttons.
    expect(base(inner.className)).toContain('flex-col');
    const py = num(inner.className, /^py-(\d+)$/) * SPACING_PX * 2;
    const gap = num(inner.className, /^gap-(\d+)$/) * SPACING_PX;
    // The copy: clamped lines x line height.
    const lines = num(copy.className, /^line-clamp-(\d+)$/);
    const leading = num(copy.className, /^leading-(\d+)$/) * SPACING_PX;
    // The button row: ONE row (no wrap) of min-h-11 buttons.
    expect(base(buttonRow.className)).not.toContain('flex-wrap');
    expect(base(buttonRow.className)).not.toContain('flex-col');
    const buttons = Array.from(buttonRow.querySelectorAll('button'));
    expect(buttons).toHaveLength(3);
    const rowHeight = Math.max(...buttons.map((b) => num(b.className, /^min-h-(\d+)$/) * SPACING_PX));

    const total = border + py + lines * leading + gap + rowHeight;
    expect({ border, py, copy: lines * leading, gap, rowHeight, total }).toEqual({
      border: 1,
      py: 24,
      copy: 40,
      gap: 8,
      rowHeight: 44,
      total: 117,
    });
    expect(total).toBeLessThanOrEqual(120);
  });

  it('the "More" link is no taller than the clamped copy it sits beside', () => {
    renderBanner();
    const more = screen.getByRole('button', { name: 'More' });
    const copy = more.parentElement!.querySelector('p')!;
    expect(num(more.className, /^min-h-(\d+)$/)).toBeLessThanOrEqual(
      num(copy.className, /^line-clamp-(\d+)$/) * num(copy.className, /^leading-(\d+)$/),
    );
    expect(more.className).toMatch(/(?:^|\s)sm:hidden(?:\s|$)/);
  });

  it('Accept and Decline are identical: same component, variant, size and classes; both flex-1 and >= 44px', () => {
    renderBanner();
    const accept = screen.getByRole('button', { name: 'Accept' });
    const decline = screen.getByRole('button', { name: 'Decline' });
    expect(accept.className).toBe(decline.className);
    expect(accept.getAttribute('data-slot')).toBe('button');
    expect(decline.getAttribute('data-slot')).toBe('button');
    expect(EQUAL_CHOICE).toMatch(/(?:^|\s)flex-1(?:\s|$)/);
    expect(EQUAL_CHOICE).toMatch(/(?:^|\s)min-h-11(?:\s|$)/);
    // Neither is the primary (filled) variant.
    expect(accept.className).not.toMatch(/(?:^|\s)bg-primary(?:\s|$)/);
  });

  it('Customize is a text (ghost) button and opens the preferences centre; so does More', () => {
    const { onCustomize } = renderBanner();
    const customize = screen.getByRole('button', { name: 'Customize' });
    expect(customize.className).not.toMatch(/(?:^|\s)border(?:\s|$)/);
    fireEvent.click(customize);
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(onCustomize).toHaveBeenCalledTimes(2);
  });

  it('Accept and Decline store the choice from the banner', () => {
    const { onDecided } = renderBanner();
    fireEvent.click(screen.getByRole('button', { name: 'Decline' }));
    fireEvent.click(screen.getByRole('button', { name: 'Accept' }));
    expect(consent.setConsent.mock.calls).toEqual([
      [{ analytics: false, mechanism: 'banner' }],
      [{ analytics: true, mechanism: 'banner' }],
    ]);
    expect(onDecided.mock.calls).toEqual([[false], [true]]);
  });

  it('keeps the privacy-policy link in the desktop layout (hidden below sm, where More replaces it)', () => {
    renderBanner();
    const link = screen.getByRole('link', { name: 'Read the privacy policy' });
    expect(link.getAttribute('href')).toBe('/privacy-policy');
    expect(link.parentElement!.className).toMatch(/(?:^|\s)hidden(?:\s|$)/);
    expect(link.parentElement!.className).toMatch(/(?:^|\s)sm:inline(?:\s|$)/);
  });
});
