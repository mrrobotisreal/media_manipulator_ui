import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

// MM122 decision 3 / acceptance 3: the per-word editor on the caption lane. A boundary drag
// retimes (clamped to the neighbours, snapped to one frame) as ONE undo step; a click toggles
// emphasis; without CaptionWordEdit the words are read-only and a drag or click opens the
// upgrade interstitial instead of editing.
vi.mock('@/lib/studio/studioBackend', async (orig) => ({
  ...(await orig<typeof import('@/lib/studio/studioBackend')>()),
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached');
  },
}));
vi.mock('@/i18n/useLocalization', () => ({ useLocalization: () => ({ t: (k: string) => k, language: { code: 'en-US' } }) }));
const auth = { tier: 'premium', limits: { captionWordEdit: true } as Record<string, unknown>, openAuth: vi.fn() };
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => auth }));
const publish = vi.fn();
vi.mock('@/lib/auth/quotaBus', async (orig) => ({ ...(await orig<typeof import('@/lib/auth/quotaBus')>()), publishLimitRefusal: (d: unknown) => publish(d) }));
const track = vi.fn();
vi.mock('@/lib/analytics', async (orig) => ({ ...(await orig<typeof import('@/lib/analytics')>()), analytics: { track: (...a: unknown[]) => track(...a) } }));

import { useStudioStore } from '@/lib/studioStore';
import { studioFixture } from '@/lib/assistant/ops/studioFixture';
import { CaptionWordStrip } from './caption-lane';

const store = () => useStudioStore.getState();
const ZOOM = 100; // px per second
const cue = () => store().project!.captions[0];

beforeEach(() => {
  const p = { ...studioFixture(), fps: 30, captions: [{ id: 'q', startSeconds: 1, endSeconds: 4, text: 'one two three', words: [
    { text: 'one', startSeconds: 1.1, endSeconds: 1.8 },
    { text: 'two', startSeconds: 1.9, endSeconds: 2.6 },
    { text: 'three', startSeconds: 2.7, endSeconds: 3.6 },
  ] }] };
  store().loadProject(p);
  auth.tier = 'premium';
  auth.limits = { captionWordEdit: true };
  publish.mockClear();
  track.mockClear();
});
afterEach(() => {
  cleanup();
  store().closeProject();
});

const strip = () => render(<CaptionWordStrip cue={cue()} zoom={ZOOM} />);
const drag = (el: Element, dx: number[]) => {
  fireEvent.pointerDown(el, { clientX: 0, pointerId: 1 });
  for (const x of dx) fireEvent.pointerMove(el, { clientX: x, pointerId: 1 });
  fireEvent.pointerUp(el, { clientX: dx[dx.length - 1], pointerId: 1 });
};

describe('caption word strip (Premium)', () => {
  it('a boundary drag retimes both neighbours, snapped to a frame, as one undo step', () => {
    strip();
    const before = store().past.length;
    drag(screen.getByTestId('caption-boundary-1'), [5, 9, 11.2]); // +0.112 s → 2.012 → snapped 2.0
    expect(cue().words![1].startSeconds).toBeCloseTo(2, 6);
    expect(cue().words![0].endSeconds).toBeCloseTo(2, 6);
    expect(store().past.length).toBe(before + 1);
    store().undo();
    expect(cue().words![1].startSeconds).toBe(1.9);
    expect(track).toHaveBeenCalledWith('studio_caption_word_edited', expect.objectContaining({ kind: 'retime', source: 'ui' }), expect.anything());
  });

  it('clamps the drag between the neighbouring boundaries', () => {
    strip();
    drag(screen.getByTestId('caption-boundary-1'), [-500]);
    expect(cue().words![1].startSeconds).toBeCloseTo(1.1 + 1 / 30, 6);
    cleanup();
    strip();
    drag(screen.getByTestId('caption-boundary-1'), [500]);
    expect(cue().words![1].startSeconds).toBeCloseTo(2.7 - 1 / 30, 6);
  });

  it('a click toggles emphasis on that word', () => {
    strip();
    fireEvent.click(screen.getByTestId('caption-word-2'));
    expect(cue().words![2].emphasis).toBe(true);
    expect(track).toHaveBeenCalledWith('studio_caption_word_edited', expect.objectContaining({ kind: 'emphasis' }), expect.anything());
  });
});

describe('caption word strip (Free: read-only)', () => {
  it('shows the words, but a drag or click edits nothing and opens the upgrade interstitial', () => {
    auth.tier = 'free';
    auth.limits = { captionWordEdit: false };
    strip();
    expect(screen.getByTestId('caption-word-0').textContent).toBe('one');
    const before = JSON.stringify(cue());
    drag(screen.getByTestId('caption-boundary-1'), [40]);
    fireEvent.click(screen.getByTestId('caption-word-1'));
    expect(JSON.stringify(cue())).toBe(before);
    expect(publish).toHaveBeenCalledWith(expect.objectContaining({ error: 'caption_word_edit', upgradePath: 'premium', fromClick: true }));
    expect(track).not.toHaveBeenCalled();
  });
});
