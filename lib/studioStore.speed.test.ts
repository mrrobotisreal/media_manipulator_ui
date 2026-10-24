import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached from store unit tests');
  },
}));

import { useStudioStore } from '@/lib/studioStore';
import type { StudioAsset, StudioClip, StudioProject, StudioTrack } from '@/lib/studioTypes';

const store = () => useStudioStore.getState();

const clip = (id: string, assetId: string, start: number, dur: number, extra: Partial<StudioClip> = {}): StudioClip => ({
  id,
  assetId,
  streamIndex: 0,
  timelineStart: start,
  sourceIn: 0,
  sourceOut: dur,
  ...extra,
});

const track = (id: string, kind: 'video' | 'audio', index: number, clips: StudioClip[]): StudioTrack => ({
  id, kind, index, muted: false, clips,
});

const project = (tracks: StudioTrack[]): StudioProject => ({
  id: 'p1', name: 'T', schemaVersion: 3, fps: 30, width: 1920, height: 1080, durationSeconds: 0,
  tracks, captions: [], captionsEnabled: true,
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
});

const asset = (id: string, extra: Partial<StudioAsset> = {}): StudioAsset => ({
  id, projectId: 'p1', originalFileName: `${id}.mp4`, s3KeyOriginal: id, mediaKind: 'video',
  durationSeconds: 30, hasAudio: true, probeJson: null, createdAt: '2026-01-01T00:00:00Z', ...extra,
});

const byId = (id: string): StudioClip => {
  const f = store().findClip(id);
  if (!f) throw new Error(`clip ${id}`);
  return f.clip;
};

function setup(clips: StudioClip[]) {
  store().loadProject(project([track('v', 'video', 0, clips), track('a', 'audio', 0, [])]));
  store().setAssets([asset('vid'), asset('img', { mediaKind: 'image', hasAudio: false })]);
}

beforeEach(() => {
  store().closeProject();
});

describe('setClipSpeed (no ripple)', () => {
  it('speed-up shrinks in place and leaves a gap; neighbours never move', () => {
    setup([clip('a', 'vid', 0, 4), clip('b', 'vid', 4, 4)]);
    store().setClipSpeed('a', 2);
    expect(byId('a').speed).toBe(2);
    expect(byId('b').timelineStart).toBe(4); // untouched
    expect(store().duration).toBe(8);
  });

  it('slow-down clamps against the next clip and reports it', () => {
    setup([clip('a', 'vid', 0, 4), clip('b', 'vid', 6, 2)]);
    const plan = store().setClipSpeed('a', 0.25)!;
    expect(plan.clamped).toBe(true);
    expect(plan.reason).toBe('neighbor');
    expect(byId('a').speed).toBeCloseTo(4 / 6, 9);
    expect(byId('b').timelineStart).toBe(6);
  });

  it('speed 1 clears the field so v1/v2 clips stay byte-stable', () => {
    setup([clip('a', 'vid', 0, 4, { speed: 2 })]);
    store().setClipSpeed('a', 1);
    expect('speed' in byId('a') && byId('a').speed !== undefined).toBe(false);
  });

  it('is one undo entry', () => {
    setup([clip('a', 'vid', 0, 4)]);
    store().setClipSpeed('a', 2);
    expect(store().past).toHaveLength(1);
    store().undo();
    expect(byId('a').speed).toBeUndefined();
    store().redo();
    expect(byId('a').speed).toBe(2);
  });

  it('a scrub inside a gesture collapses to one entry', () => {
    setup([clip('a', 'vid', 0, 4)]);
    store().beginGesture();
    for (const s of [1.1, 1.2, 1.5, 2]) store().setClipSpeed('a', s);
    store().endGesture();
    expect(store().past).toHaveLength(1);
    store().undo();
    expect(byId('a').speed).toBeUndefined();
  });

  it('refuses image clips (MM15) and title clips', () => {
    setup([clip('i', 'img', 0, 5)]);
    expect(store().setClipSpeed('i', 2)).toBeNull();
    expect(byId('i').speed).toBeUndefined();
    store().setClipReverse('i', true);
    expect(byId('i').reverse).toBeUndefined();
    expect(store().addFreezeFrame('i')).toBeNull();
    expect(store().past).toHaveLength(0);
  });
});

describe('setClipDuration (back-solve)', () => {
  it('duration edit becomes speed', () => {
    setup([clip('a', 'vid', 0, 4)]);
    store().setClipDuration('a', 2);
    expect(byId('a').speed).toBe(2);
    store().setClipDuration('a', 8);
    expect(byId('a').speed).toBe(0.5);
  });
});

describe('reverse + pitch', () => {
  it('reverse toggles on/off and does not touch duration or neighbours', () => {
    setup([clip('a', 'vid', 0, 4), clip('b', 'vid', 4, 2)]);
    store().setClipReverse('a', true);
    expect(byId('a').reverse).toBe(true);
    expect(store().duration).toBe(6);
    store().setClipReverse('a', false);
    expect(byId('a').reverse).toBeUndefined();
  });

  it('maintainPitch is stored only when turned off', () => {
    setup([clip('a', 'vid', 0, 4)]);
    store().setClipMaintainPitch('a', false);
    expect(byId('a').maintainPitch).toBe(false);
    store().setClipMaintainPitch('a', true);
    expect(byId('a').maintainPitch).toBeUndefined();
  });
});

describe('addFreezeFrame', () => {
  it('inserts a 2s held frame after the clip at the playhead source time', () => {
    setup([clip('a', 'vid', 0, 6, { speed: 2 })]); // timeline [0,3]
    store().setPlayhead(1);
    const res = store().addFreezeFrame('a')!;
    const fz = byId(res.clipId);
    expect(fz.freeze).toEqual({ sourceTime: 2 });
    expect(fz.timelineStart).toBe(3);
    expect(fz.sourceOut - fz.sourceIn).toBe(2);
    expect(fz.volume).toBeUndefined(); // silent
    expect(store().selectedClipIds).toEqual([res.clipId]);
    expect(res.bounded).toBe(false);
    expect(byId('a').timelineStart).toBe(0);
  });

  it('is bounded by the neighbour and undoable', () => {
    setup([clip('a', 'vid', 0, 4), clip('b', 'vid', 5, 2)]);
    store().setPlayhead(2);
    const res = store().addFreezeFrame('a')!;
    expect(res.bounded).toBe(true);
    expect(byId(res.clipId).sourceOut - byId(res.clipId).sourceIn).toBe(1);
    store().undo();
    expect(store().findClip(res.clipId)).toBeFalsy();
  });

  it('returns null when there is no room', () => {
    setup([clip('a', 'vid', 0, 4), clip('b', 'vid', 4.05, 2)]);
    expect(store().addFreezeFrame('a')).toBeNull();
    expect(store().past).toHaveLength(0);
  });

  it('freeze duration edits resize the hold', () => {
    setup([clip('a', 'vid', 0, 4)]);
    store().setPlayhead(1);
    const { clipId } = store().addFreezeFrame('a')!;
    store().setClipDuration(clipId, 3.5);
    const fz = byId(clipId);
    expect(fz.sourceOut - fz.sourceIn).toBe(3.5);
    expect(fz.freeze).toBeTruthy();
  });
});

describe('splitAtPlayhead with speed', () => {
  it('forward 2x: cut maps through the speed; halves tile the source', () => {
    setup([clip('a', 'vid', 0, 8, { speed: 2 })]); // timeline [0,4]
    store().setPlayhead(1);
    store().splitAtPlayhead();
    const [l, r] = store().project!.tracks[0].clips;
    expect(l.sourceIn).toBe(0);
    expect(l.sourceOut).toBe(2);
    expect(r.sourceIn).toBe(2);
    expect(r.sourceOut).toBe(8);
    expect(r.timelineStart).toBe(1);
    expect(l.speed).toBe(2);
    expect(r.speed).toBe(2);
  });

  it('reversed: the left half is the tail of the source', () => {
    setup([clip('a', 'vid', 0, 8, { reverse: true })]);
    store().setPlayhead(3);
    store().splitAtPlayhead();
    const [l, r] = store().project!.tracks[0].clips;
    expect([l.sourceIn, l.sourceOut]).toEqual([5, 8]);
    expect([r.sourceIn, r.sourceOut]).toEqual([0, 5]);
  });
});
