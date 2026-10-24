import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached from store unit tests');
  },
}));

import { useStudioStore } from '@/lib/studioStore';
import { presetEffects, presetById } from '@/lib/studio/audioPresets';
import { studioProjectSchema } from '@/lib/studioTypes';
import type { StudioProject } from '@/lib/studioTypes';

const store = () => useStudioStore.getState();
const project = (): StudioProject => ({
  id: 'p1', name: 'T', schemaVersion: 3, fps: 30, width: 1920, height: 1080, durationSeconds: 0,
  tracks: [
    { id: 'v', kind: 'video', index: 0, muted: false, clips: [] },
    { id: 'a1', kind: 'audio', index: 0, muted: false, clips: [] },
    { id: 'a2', kind: 'audio', index: 1, muted: false, clips: [] },
  ],
  captions: [], captionsEnabled: true,
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
});
const trk = (id: string) => store().project!.tracks.find((t) => t.id === id)!;

beforeEach(() => {
  store().closeProject();
  store().loadProject(project());
});

describe('mixer store actions (part 19)', () => {
  it('track gain/pan: clamped, neutral stored as absent, one undo entry per call', () => {
    const before = store().past.length;
    store().setTrackGain('a1', 0.5);
    store().setTrackPan('a1', -0.25);
    expect(trk('a1').gain).toBe(0.5);
    expect(trk('a1').pan).toBe(-0.25);
    expect(store().past.length).toBe(before + 2);
    store().setTrackGain('a1', 9);
    expect(trk('a1').gain).toBe(2);
    store().setTrackGain('a1', 1);
    store().setTrackPan('a1', 0);
    expect('gain' in trk('a1') && trk('a1').gain !== undefined).toBe(false);
    expect(trk('a1').pan).toBeUndefined();
  });

  it('a fader drag inside a gesture is ONE undo entry', () => {
    const before = store().past.length;
    store().beginGesture();
    for (const g of [0.9, 0.8, 0.7, 0.6]) store().setTrackGain('a1', g);
    store().endGesture();
    expect(store().past.length).toBe(before + 1);
    store().undo();
    expect(trk('a1').gain).toBeUndefined();
  });

  it('no-op writes record nothing', () => {
    const before = store().past.length;
    store().setTrackGain('a1', 1);
    store().setTrackPan('a1', 0);
    store().setTrackEffects('a1', undefined);
    store().setMasterGain(1);
    expect(store().past.length).toBe(before);
    expect(store().project!.audio).toBeUndefined();
  });

  it('applying a preset sets EQ + compressor and stays editable', () => {
    store().setTrackEffects('a1', presetEffects(presetById('voiceClarity')!));
    expect(trk('a1').effects?.eq?.highGainDb).toBe(3);
    const fx = trk('a1').effects!;
    store().setTrackEffects('a1', { ...fx, eq: { ...fx.eq!, highGainDb: 5 } });
    expect(trk('a1').effects?.eq?.highGainDb).toBe(5);
    store().setTrackEffects('a1', { eq: { lowGainDb: 0, midGainDb: 0, highGainDb: 0 } });
    expect(trk('a1').effects).toBeUndefined();
  });

  it('master gain lives in audio.masterGain, round-trips the Zod schema, clears at unity', () => {
    store().setMasterGain(0.6);
    expect(store().project!.audio?.masterGain).toBe(0.6);
    expect(() => studioProjectSchema.parse(store().project)).not.toThrow();
    store().setMasterGain(1);
    expect(store().project!.audio?.masterGain).toBeUndefined();
  });

  it('mute/solo from the mixer are the same store state as the timeline header', () => {
    store().toggleTrackSolo('a2');
    expect(trk('a2').solo).toBe(true);
    store().toggleTrackMute('a1');
    expect(trk('a1').muted).toBe(true);
  });

  it('mixer drawer visibility is ephemeral (not in history)', () => {
    const before = store().past.length;
    store().setMixerOpen(true);
    expect(store().mixerOpen).toBe(true);
    expect(store().past.length).toBe(before);
  });

  it('a project with no mixer fields is byte-stable through the schema', () => {
    const p = project();
    expect(JSON.stringify(studioProjectSchema.parse(p).tracks)).toBe(JSON.stringify(p.tracks));
  });
});
