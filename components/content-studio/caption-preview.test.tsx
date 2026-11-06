import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const manualRender = vi.fn(async () => undefined);
const setTrack = vi.fn();
const destroy = vi.fn(async () => undefined);
let fail = false;
vi.mock('@/lib/studio/captions/jassubPreview', async (orig) => {
  const real = await orig<typeof import('@/lib/studio/captions/jassubPreview')>();
  return {
    ...real,
    startJassub: vi.fn(async () => {
      if (fail) throw new real.CaptionPreviewError('load_failed');
      return { ready: Promise.resolve(), renderer: { setTrack }, manualRender, resize: vi.fn(), destroy };
    }),
  };
});
const track = vi.fn();
vi.mock('@/lib/analytics', async (orig) => ({ ...(await orig<typeof import('@/lib/analytics')>()), analytics: { track: (...a: unknown[]) => track(...a) } }));

import CaptionPreview, { letterbox } from './caption-preview';
import { useStudioStore } from '@/lib/studioStore';

const cues = [{ id: 'a', startSeconds: 0, endSeconds: 2, text: 'hello there' }];
const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 0)); });

describe('CaptionPreview (MM121 decision 5)', () => {
  beforeEach(() => {
    manualRender.mockClear();
    setTrack.mockClear();
    track.mockClear();
    fail = false;
    useStudioStore.setState({ playhead: 0, isPlaying: false });
  });
  afterEach(() => vi.useRealTimers());

  it('letterboxes to the project rect inside the preview box', () => {
    expect(letterbox(800, 600, 1920, 1080)).toEqual({ x: 0, y: 75, w: 800, h: 450 });
    expect(letterbox(800, 450, 1080, 1920)).toMatchObject({ y: 0, h: 450 });
  });

  it('renders at the playhead, paused and playing (seek accuracy: mediaTime = playhead)', async () => {
    render(<CaptionPreview cues={cues} style={undefined} projectW={1920} projectH={1080} boxW={800} boxH={450} />);
    await flush();
    expect(manualRender).toHaveBeenCalled();
    for (const t of [1.234, 0.5, 17.04]) {
      act(() => useStudioStore.setState({ playhead: t }));
      expect(manualRender).toHaveBeenLastCalledWith(expect.objectContaining({ mediaTime: t, width: 800, height: 450 }), true);
    }
    act(() => useStudioStore.setState({ isPlaying: true, playhead: 2.5 }));
    expect(manualRender).toHaveBeenLastCalledWith(expect.objectContaining({ mediaTime: 2.5 }), false);
  });

  it('pushes a new track when the cues or style change', async () => {
    const { rerender } = render(<CaptionPreview cues={cues} style={undefined} projectW={1920} projectH={1080} boxW={800} boxH={450} />);
    await flush();
    rerender(<CaptionPreview cues={[{ ...cues[0], text: 'changed' }]} style={undefined} projectW={1920} projectH={1080} boxW={800} boxH={450} />);
    await flush();
    expect(setTrack).toHaveBeenLastCalledWith(expect.stringContaining('Dialogue: 1,0:00:00.00,0:00:02.00,Default,,0,0,0,,changed'));
  });

  it('falls back to plain text and logs studio_caption_renderer_fallback once', async () => {
    fail = true;
    const { findByTestId } = render(<CaptionPreview cues={cues} style={undefined} projectW={1920} projectH={1080} boxW={800} boxH={450} />);
    await flush();
    expect((await findByTestId('caption-fallback')).textContent).toBe('hello there');
    expect(track).toHaveBeenCalledWith('studio_caption_renderer_fallback', expect.objectContaining({ reason: 'load_failed' }), { feature: 'studio' });
  });
});
