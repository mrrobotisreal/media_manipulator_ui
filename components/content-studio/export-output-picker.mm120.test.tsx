import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

// MM120: a Premium caller sees the Pro presets with a Pro badge; picking one records
// studio_export_format_locked {required: 'pro'} and opens the interstitial routed to Pro.
const track = vi.fn();
const refusals: unknown[] = [];
vi.mock('@/i18n/useLocalization', () => ({ useLocalization: () => ({ t: (k: string) => k, language: { code: 'en-US' } }) }));
vi.mock('@/lib/analytics', async (orig) => ({ ...(await orig<typeof import('@/lib/analytics')>()), analytics: { track: (...a: unknown[]) => track(...a) } }));
vi.mock('@/lib/auth/quotaBus', () => ({ publishLimitRefusal: (d: unknown) => refusals.push(d) }));

import { ExportOutputPicker } from './export-output-picker';
import { STATIC_STUDIO_OUTPUTS, defaultOutputAccess, presetChoice, presetByKey } from '@/lib/studio/studioOutputs';
import { EVENTS } from '@/lib/analytics';

const PREMIUM = ['mp4', 'mov', 'mkv', 'webm', 'mp3', 'wav', 'opus', 'h264', 'hevc', 'vp9', 'aac', 'pcm_s16le', 'vorbis', 'subs_embedded'];
afterEach(() => {
  cleanup();
  track.mockClear();
  refusals.length = 0;
});

describe('ExportOutputPicker MM120 Pro badges', () => {
  it('Premium: picking a Pro preset tracks required pro and routes the interstitial to Pro', () => {
    globalThis.ResizeObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    Element.prototype.scrollIntoView ??= () => undefined;
    Element.prototype.hasPointerCapture ??= () => false;
    const onChange = vi.fn();
    render(
      <ExportOutputPicker
        table={STATIC_STUDIO_OUTPUTS}
        access={{ ...defaultOutputAccess(), formats: PREMIUM, advanced: true, tier: 'premium' }}
        mode="preset"
        outputPreset="mp4_h264"
        output={presetChoice(presetByKey('mp4_h264')!)}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('combobox', { name: 'contentStudio.export.format' }));
    const item = screen.getByText('contentStudio.export.preset_mov_prores').closest('[role="option"]') as HTMLElement;
    expect(item.textContent).toContain('Pro');
    fireEvent.click(item);
    expect(onChange).not.toHaveBeenCalled();
    expect(track).toHaveBeenCalledWith(EVENTS.STUDIO_EXPORT_FORMAT_LOCKED, expect.objectContaining({ option: 'prores', required: 'pro', tier: 'premium' }), expect.anything());
    expect(refusals).toEqual([expect.objectContaining({ error: 'format_not_in_plan', option: 'prores', required: 'pro', upgradePath: 'pro', fromClick: true })]);
  });
});
