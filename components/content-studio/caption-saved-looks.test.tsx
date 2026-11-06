import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

// MM122 decision 4 / acceptance 5: saved caption looks in the caption editor. Premium at its
// 10-look cap gets the Pro upsell on Save (no request); free sees the lock and the Premium
// interstitial; anonymous is sent to sign-up; a saved look applies; the CreaTV embed hides all.
vi.mock('@/i18n/useLocalization', () => ({ useLocalization: () => ({ t: (k: string) => k, language: { code: 'en-US' } }) }));
const auth = { tier: 'premium', limits: { captionLooksSaved: 10 } as Record<string, unknown>, openAuth: vi.fn() };
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => auth }));
const publish = vi.fn();
vi.mock('@/lib/auth/quotaBus', async (orig) => ({ ...(await orig<typeof import('@/lib/auth/quotaBus')>()), publishLimitRefusal: (d: unknown) => publish(d) }));
const track = vi.fn();
vi.mock('@/lib/analytics', async (orig) => ({ ...(await orig<typeof import('@/lib/analytics')>()), analytics: { track: (...a: unknown[]) => track(...a) } }));
const caps = { captionLooks: true };
vi.mock('@/lib/studio/studioBackendProvider', () => ({ useStudioBackend: () => ({ capabilities: caps }) }));
vi.mock('./caption-look-preview', () => ({ default: () => null }));
const style = { fontSizePct: 7, color: '#FFFFFF', backgroundColor: '#000000', backgroundOpacity: 0.6, position: 'bottom' as const, maxWidthPct: 85, animation: 'glow' as const };
let list = { looks: [] as unknown[], limit: 10, used: 0 };
const mutateAsync = vi.fn(async () => ({ look: { id: 'n', name: 'Mine', style, revision: 1, updatedAt: '' }, used: 4 }));
vi.mock('@/lib/studio/captions/captionLooksApi', async (orig) => ({
  ...(await orig<typeof import('@/lib/studio/captions/captionLooksApi')>()),
  useSavedCaptionLooks: (enabled: boolean) => ({ data: enabled ? list : undefined }),
  useCreateSavedCaptionLook: () => ({ mutateAsync, isPending: false }),
  useDeleteSavedCaptionLook: () => ({ mutate: vi.fn() }),
}));

import CaptionSavedLooks from './caption-saved-looks';
import { savedLookPatch } from './caption-editor';

const onApply = vi.fn();
beforeEach(() => {
  auth.tier = 'premium';
  auth.limits = { captionLooksSaved: 10 };
  caps.captionLooks = true;
  list = { looks: [], limit: 10, used: 0 };
  publish.mockClear();
  track.mockClear();
  mutateAsync.mockClear();
  onApply.mockClear();
});
afterEach(() => cleanup());

describe('saved caption looks', () => {
  it('Premium saves a named look (studio_caption_look_saved with a count bucket)', async () => {
    render(<CaptionSavedLooks style={style} onApply={onApply} />);
    fireEvent.click(screen.getByTestId('caption-save-look'));
    fireEvent.change(screen.getByLabelText('contentStudio.captions.saveLookName'), { target: { value: 'Mine' } });
    fireEvent.click(screen.getByText('contentStudio.captions.saveLookConfirm'));
    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith({ name: 'Mine', style }));
    await waitFor(() => expect(track).toHaveBeenCalledWith('studio_caption_look_saved', expect.objectContaining({ tier: 'premium', count: '2-5' }), expect.anything()));
  });

  it('the 11th on Premium opens the Pro upsell without a request', () => {
    list = { looks: Array.from({ length: 10 }, (_, i) => ({ id: `l${i}`, name: `L${i}`, style, revision: 1, updatedAt: '' })), limit: 10, used: 10 };
    render(<CaptionSavedLooks style={style} onApply={onApply} />);
    fireEvent.click(screen.getByTestId('caption-save-look'));
    expect(mutateAsync).not.toHaveBeenCalled();
    expect(publish).toHaveBeenCalledWith(expect.objectContaining({ error: 'caption_looks_limit', limit: 10, used: 10, upgradePath: 'pro' }));
    expect(track).toHaveBeenCalledWith('studio_caption_look_limit_hit', expect.objectContaining({ tier: 'premium', limit: 10 }), expect.anything());
  });

  it('free sees the lock; Save opens the Premium interstitial', () => {
    auth.tier = 'free';
    auth.limits = { captionLooksSaved: 0 };
    render(<CaptionSavedLooks style={style} onApply={onApply} />);
    expect(screen.getByText('contentStudio.captions.saveLookLocked')).toBeTruthy();
    fireEvent.click(screen.getByTestId('caption-save-look'));
    expect(publish).toHaveBeenCalledWith(expect.objectContaining({ error: 'caption_looks_limit', upgradePath: 'premium' }));
  });

  it('anonymous is sent to sign-up', () => {
    auth.tier = 'anonymous';
    auth.limits = { captionLooksSaved: 0 };
    render(<CaptionSavedLooks style={style} onApply={onApply} />);
    fireEvent.click(screen.getByTestId('caption-save-look'));
    expect(auth.openAuth).toHaveBeenCalledWith(expect.objectContaining({ intent: 'signup' }));
  });

  it('a saved look applies as a full style (no catalog lookId), and the embed hides the section', () => {
    list = { looks: [{ id: 'a', name: 'Mine', style, revision: 1, updatedAt: '' }], limit: 10, used: 1 };
    render(<CaptionSavedLooks style={style} onApply={onApply} />);
    fireEvent.click(screen.getByTestId('saved-look-a'));
    expect(onApply).toHaveBeenCalledWith(style);
    expect(track).toHaveBeenCalledWith('studio_caption_look_applied', expect.objectContaining({ lookId: 'saved' }), expect.anything());
    const patch = savedLookPatch({ ...style, lookId: 'neon' });
    expect('wordsPerGroup' in patch && patch.wordsPerGroup === undefined).toBe(true);
    expect(patch.lookId).toBeUndefined();
    expect(patch.animation).toBe('glow');
    cleanup();
    caps.captionLooks = false;
    render(<CaptionSavedLooks style={style} onApply={onApply} />);
    expect(screen.queryByTestId('caption-saved-looks')).toBeNull();
  });
});
