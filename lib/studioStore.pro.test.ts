import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached from store unit tests');
  },
}));

import { useStudioStore } from '@/lib/studioStore';
import type { StudioAsset, StudioClip, StudioProject, StudioTrack } from '@/lib/studioTypes';

const store = () => useStudioStore.getState();

const clip = (id: string, assetId: string, start: number, sIn: number, sOut: number, extra: Partial<StudioClip> = {}): StudioClip => ({
  id, assetId, streamIndex: 0, timelineStart: start, sourceIn: sIn, sourceOut: sOut, ...extra,
});
const track = (id: string, kind: 'video' | 'audio', index: number, clips: StudioClip[], extra: Partial<StudioTrack> = {}): StudioTrack => ({
  id, kind, index, muted: false, clips, ...extra,
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
const histLen = () => store().past.length;

function setup(tracks: StudioTrack[]) {
  store().loadProject(project(tracks));
  store().setAssets([asset('vid'), asset('img', { mediaKind: 'image', hasAudio: false }), asset('aud', { mediaKind: 'audio' })]);
}

beforeEach(() => {
  store().closeProject();
});

describe('tool mode (ephemeral)', () => {
  it('switches without touching the document or history', () => {
    setup([track('v', 'video', 0, [clip('a', 'vid', 0, 0, 4)])]);
    const doc = store().project;
    store().setToolMode('razor');
    expect(store().toolMode).toBe('razor');
    expect(store().project).toBe(doc);
    expect(histLen()).toBe(0);
    expect(store().dirty).toBe(false);
  });
  it('snapping toggles and defaults on; neither is undoable state', () => {
    setup([track('v', 'video', 0, [])]);
    expect(store().snapping).toBe(true);
    store().toggleSnapping();
    expect(store().snapping).toBe(false);
    expect(histLen()).toBe(0);
  });
  it('closeProject resets the tool to select', () => {
    setup([track('v', 'video', 0, [])]);
    store().setToolMode('hand');
    store().closeProject();
    expect(store().toolMode).toBe('select');
  });
});

describe('roll / slip / slide store actions: one undo entry per gesture', () => {
  it('a rolled gesture of many moves undoes in one step', () => {
    setup([track('v', 'video', 0, [clip('A', 'vid', 0, 5, 10), clip('B', 'vid', 5, 10, 15)])]);
    store().beginGesture();
    for (const d of [0.5, 1, 1.5, 2]) store().rollEdit('v', 5, d);
    store().endGesture();
    expect(histLen()).toBe(1);
    expect(byId('B').timelineStart).toBeGreaterThan(5);
    store().undo();
    expect(byId('A').sourceOut).toBe(10);
    expect(byId('B').timelineStart).toBe(5);
  });

  it('slipClip returns the applied (clamped) delta and no-ops on stills', () => {
    setup([track('v', 'video', 0, [clip('a', 'vid', 0, 5, 10), clip('i', 'img', 6, 0, 5)])]);
    expect(store().slipClip('a', 100)).toBe(20);
    expect(byId('a').sourceOut).toBe(30);
    expect(byId('a').timelineStart).toBe(0);
    const before = store().project;
    expect(store().slipClip('i', 1)).toBe(0); // image: no source range
    expect(store().project).toBe(before);
  });

  it('slideClip moves with neighbors absorbing', () => {
    setup([track('v', 'video', 0, [clip('p', 'vid', 0, 0, 4), clip('m', 'vid', 4, 10, 14), clip('n', 'vid', 8, 5, 9)])]);
    expect(store().slideClip('m', 1)).toBe(1);
    expect(byId('m').timelineStart).toBe(5);
    expect(byId('p').sourceOut).toBe(5);
    expect(byId('n').timelineStart).toBe(9);
  });

  it('rippleTrimToPlayhead trims the selected track and closes up', () => {
    setup([
      track('v', 'video', 0, [clip('a', 'vid', 0, 0, 4), clip('b', 'vid', 4, 0, 4)]),
      track('au', 'audio', 0, [clip('m', 'aud', 0, 0, 20)]),
    ]);
    store().selectClip('a');
    store().setPlayhead(2);
    expect(store().rippleTrimToPlayhead('next')).toBe(1);
    expect(byId('a').sourceOut).toBe(2);
    expect(byId('b').timelineStart).toBe(2);
    expect(byId('m').sourceOut).toBe(20); // audio track untouched (not selected)
    expect(histLen()).toBe(1);
  });
});

describe('speed-aware pro trims (part 17 integration)', () => {
  it('slide neighbors that are sped up absorb in timeline seconds', () => {
    setup([track('v', 'video', 0, [
      clip('p', 'vid', 0, 0, 8, { speed: 2 }), // 0..4
      clip('m', 'vid', 4, 10, 14),             // 4..8
    ])]);
    store().slideClip('m', 1); // p grows by 1 timeline s = 2 source s
    expect(byId('p').sourceOut).toBe(10);
  });
});

describe('lock enforcement (store-level)', () => {
  const locked = () => setup([
    track('v', 'video', 0, [clip('a', 'vid', 0, 0, 4), clip('b', 'vid', 4, 0, 4)], { locked: true }),
    track('v2', 'video', 1, [clip('c', 'vid', 0, 0, 4)]),
  ]);

  it('rejects every mutating path on a locked track, with a lock notice', () => {
    locked();
    const doc = store().project;
    store().updateClip('a', { sourceOut: 2 });
    store().moveClip('a', 1);
    store().moveClipToTrack('a', 'v2', 10);
    store().setClipVolume('a', 0.5);
    store().setClipSpeed('a', 2);
    store().selectClip('a');
    store().deleteSelected();
    store().setPlayhead(2);
    store().splitAtPlayhead();
    expect(store().rollEdit('v', 4, 1)).toBe(0);
    expect(store().slipClip('a', 1)).toBe(0);
    expect(store().slideClip('b', 1)).toBe(0);
    expect(store().razorAt('a', 2)).toBe(false);
    expect(store().detachAudio('a')).toBeNull();
    store().setClipTransition('b', { type: 'crossDissolve', durationSeconds: 1 });
    store().addTextOverlay('a');
    expect(store().project).toBe(doc);
    expect(histLen()).toBe(0);
    expect(store().lockNotice?.trackId).toBe('v');
    expect(store().lockNotice?.seq).toBeGreaterThan(1);
  });

  it('rejects moving a clip INTO a locked track and removing it', () => {
    locked();
    const doc = store().project;
    store().moveClipToTrack('c', 'v', 20);
    store().addClipFromAssetToTrack('vid', 'v');
    store().removeTrack('v');
    expect(store().project).toBe(doc);
  });

  it('still allows edits on unlocked tracks, and unlock/lock are themselves undoable', () => {
    locked();
    store().updateClip('c', { sourceOut: 3 });
    expect(byId('c').sourceOut).toBe(3);
    store().toggleTrackLock('v');
    expect(store().project!.tracks[0].locked).toBeUndefined();
    store().updateClip('a', { sourceOut: 2 });
    expect(byId('a').sourceOut).toBe(2);
    store().undo(); // revert the edit
    store().undo(); // revert the unlock
    expect(store().project!.tracks[0].locked).toBe(true);
  });

  it('split with a selection spanning locked + unlocked cuts only the unlocked clip', () => {
    locked();
    store().selectClip('a');
    store().selectClip('c', true);
    store().setPlayhead(2);
    store().splitAtPlayhead();
    expect(store().project!.tracks[0].clips).toHaveLength(2);
    expect(store().project!.tracks[1].clips).toHaveLength(2);
  });

  it('bin delete (removeClipsForAssets) leaves locked-track clips alone', () => {
    locked();
    expect(store().removeClipsForAssets(['vid'])).toBe(1); // only c
    expect(store().project!.tracks[0].clips).toHaveLength(2);
  });
});

describe('track controls', () => {
  it('rename, hide (video only), solo (audio only) are undoable document edits', () => {
    setup([track('v', 'video', 0, []), track('au', 'audio', 0, [])]);
    store().setTrackName('v', '  Main  ');
    expect(store().project!.tracks[0].name).toBe('Main');
    store().setTrackName('v', '');
    expect(store().project!.tracks[0].name).toBeUndefined();
    store().toggleTrackHidden('v');
    expect(store().project!.tracks[0].hidden).toBe(true);
    store().toggleTrackHidden('au'); // audio: ignored
    expect(store().project!.tracks[1].hidden).toBeUndefined();
    store().toggleTrackSolo('v'); // video: ignored
    expect(store().project!.tracks[0].solo).toBeUndefined();
    store().toggleTrackSolo('au');
    expect(store().project!.tracks[1].solo).toBe(true);
    store().undo();
    expect(store().project!.tracks[1].solo).toBeUndefined();
  });

  it('several tracks can solo at once', () => {
    setup([track('v', 'video', 0, []), track('a1', 'audio', 0, []), track('a2', 'audio', 1, [])]);
    store().toggleTrackSolo('a1');
    store().toggleTrackSolo('a2');
    expect(store().project!.tracks.filter((t) => t.solo).length).toBe(2);
  });
});

describe('markers', () => {
  it('add auto-names, sorts, selects; update/remove round trip; each is one undo entry', () => {
    setup([track('v', 'video', 0, [clip('a', 'vid', 0, 0, 20)])]);
    store().setPlayhead(5);
    const m1 = store().addMarker()!;
    store().setPlayhead(2);
    const m2 = store().addMarker()!;
    const ms = store().project!.markers!;
    expect(ms.map((m) => m.name)).toEqual(['Marker 2', 'Marker 1']);
    expect(ms[0].id).toBe(m2);
    expect(ms[0].color).toBe('#22C55E');
    expect(store().selectedMarkerId).toBe(m2);
    store().updateMarker(m1, { t: 1, name: 'Intro', color: '#FF0000', comment: 'hi' });
    expect(store().project!.markers!.map((m) => m.id)).toEqual([m1, m2]);
    store().updateMarker(m1, { color: 'nope' }); // invalid hex ignored
    expect(store().project!.markers![0].color).toBe('#FF0000');
    store().removeMarker(m1);
    expect(store().project!.markers).toHaveLength(1);
    expect(histLen()).toBe(5);
    store().undo();
    expect(store().project!.markers).toHaveLength(2);
  });

  it('removing the last marker clears the field (byte-stable EDL)', () => {
    setup([track('v', 'video', 0, [])]);
    const id = store().addMarker(1)!;
    store().removeMarker(id);
    expect(store().project!.markers).toBeUndefined();
  });

  it('markers survive the save request', () => {
    setup([track('v', 'video', 0, [])]);
    store().addMarker(3);
    expect(store().toSaveRequest()!.markers).toHaveLength(1);
  });
});

describe('grouping', () => {
  const grouped = () => setup([
    track('v', 'video', 0, [clip('a', 'vid', 0, 0, 4), clip('b', 'vid', 6, 0, 4), clip('z', 'vid', 20, 0, 2)]),
    track('au', 'audio', 0, [clip('m', 'aud', 0, 0, 10)]),
  ]);

  it('group assigns one shared groupId; ungroup clears it (round trips)', () => {
    grouped();
    expect(store().groupClips(['a', 'm'])).toBe(true);
    const g = byId('a').groupId;
    expect(g).toBeTruthy();
    expect(byId('m').groupId).toBe(g);
    expect(byId('b').groupId).toBeUndefined();
    expect(store().ungroupClips(['a'])).toBe(true);
    expect(byId('a').groupId).toBeUndefined();
    expect(byId('m').groupId).toBeUndefined();
    expect(JSON.stringify(byId('a'))).not.toContain('groupId');
  });

  it('needs at least two clips', () => {
    grouped();
    expect(store().groupClips(['a'])).toBe(false);
  });

  it('selecting one member selects the whole group; additive click toggles the group', () => {
    grouped();
    store().groupClips(['a', 'm']);
    store().selectClip(null);
    store().selectClip('a');
    expect([...store().selectedClipIds].sort()).toEqual(['a', 'm']);
    store().selectClip('b', true);
    expect(store().selectedClipIds).toHaveLength(3);
    store().selectClip('m', true);
    expect(store().selectedClipIds).toEqual(['b']);
  });

  it('moveGroupBy moves every member together, clamped at 0 and by non-members', () => {
    grouped();
    store().groupClips(['a', 'm']);
    const g = byId('a').groupId!;
    // a (0..4) is followed by non-member b at 6: only 2s of room, so 3 clamps to 2
    expect(store().moveGroupBy(g, 3)).toBeCloseTo(2, 6);
    expect(byId('a').timelineStart).toBe(2);
    expect(byId('m').timelineStart).toBe(2);
    expect(store().moveGroupBy(g, -100)).toBeCloseTo(-2, 6); // clamped at 0
    expect(byId('m').timelineStart).toBe(0);
  });

  it('a locked member track blocks the whole group move', () => {
    setup([
      track('v', 'video', 0, [clip('a', 'vid', 0, 0, 4)]),
      track('au', 'audio', 0, [clip('m', 'aud', 0, 0, 10)], { locked: true }),
    ]);
    store().groupClips(['a', 'm']); // grouping touches the locked track's clip -> rejected
    expect(byId('a').groupId).toBeUndefined();
  });

  it('splitting a grouped clip yields two groups', () => {
    grouped();
    store().groupClips(['a', 'm']);
    store().selectClip('a');
    store().setPlayhead(2);
    store().splitAtPlayhead();
    const left = byId('a').groupId;
    const all = store().project!.tracks.flatMap((t) => t.clips);
    const rights = all.filter((c) => c.timelineStart === 2);
    expect(rights).toHaveLength(2);
    expect(rights[0].groupId).toBe(rights[1].groupId);
    expect(rights[0].groupId).not.toBe(left);
    expect(byId('m').groupId).toBe(left);
  });

  it('razorAt cuts the clicked clip and its group at the click time, not the selection', () => {
    grouped();
    store().groupClips(['a', 'm']);
    store().selectClip('z');
    expect(store().razorAt('a', 3)).toBe(true);
    expect(store().project!.tracks[0].clips).toHaveLength(4);
    expect(store().project!.tracks[1].clips).toHaveLength(2);
    expect(store().selectedClipIds).toEqual(['z']);
    expect(store().razorAt('a', 9)).toBe(false); // outside the clip
  });
});

describe('detachAudio', () => {
  const setupDetach = (extra: StudioTrack[] = []) =>
    setup([
      track('v', 'video', 0, [clip('a', 'vid', 2, 3, 9, { speed: 2, volume: 0.8 })]),
      track('au', 'audio', 0, [clip('m', 'aud', 0, 0, 30)]),
      ...extra,
    ]);

  it('creates an audio clip with the same asset/trim/position and silences the video clip', () => {
    setupDetach([track('au2', 'audio', 1, [])]);
    const id = store().detachAudio('a')!;
    const audio = byId(id);
    expect(audio).toMatchObject({ assetId: 'vid', timelineStart: 2, sourceIn: 3, sourceOut: 9, speed: 2, volume: 0.8 });
    expect(store().findClip(id)!.track.id).toBe('au2'); // first audio track WITH room
    expect(byId('a').volume).toBe(0);
    expect(byId('a').groupId).toBe(audio.groupId);
    expect(histLen()).toBe(1);
  });

  it('creates a new audio track when none has room', () => {
    setupDetach();
    const id = store().detachAudio('a')!;
    expect(store().project!.tracks.filter((t) => t.kind === 'audio')).toHaveLength(2);
    expect(store().findClip(id)!.track.kind).toBe('audio');
  });

  it('refuses silent assets, stills, titles, audio-track clips and already-silent clips', () => {
    setup([track('v', 'video', 0, [
      clip('i', 'img', 0, 0, 5),
      clip('s', 'vid', 6, 0, 4, { volume: 0 }),
    ]), track('au', 'audio', 0, [clip('m', 'aud', 0, 0, 5)])]);
    expect(store().detachAudio('i')).toBeNull();
    expect(store().detachAudio('s')).toBeNull();
    expect(store().detachAudio('m')).toBeNull();
  });

  it('moves volume automation to the audio clip', () => {
    setup([track('v', 'video', 0, [clip('a', 'vid', 0, 0, 5, { volumeKeyframes: [{ t: 0, gain: 1 }, { t: 2, gain: 0.5 }] })]), track('au', 'audio', 0, [])]);
    const id = store().detachAudio('a')!;
    expect(byId(id).volumeKeyframes).toHaveLength(2);
    expect(byId('a').volumeKeyframes).toBeUndefined();
  });
});

describe('image + title clips under pro tools', () => {
  it('image clips: ripple right-trim is unbounded; slip is a no-op', () => {
    setup([track('v', 'video', 0, [clip('i', 'img', 0, 0, 5), clip('b', 'vid', 5, 0, 4)])]);
    expect(store().rippleTrimClip('i', 'r', 20)).toBe(20);
    expect(byId('i').sourceOut).toBe(25);
    expect(byId('b').timelineStart).toBe(25);
    expect(Number.isFinite(byId('i').sourceOut)).toBe(true);
    expect(store().slipClip('i', 3)).toBe(0);
  });

  it('title clips: slip is a no-op, slide works', () => {
    setup([track('v', 'video', 0, [
      clip('t', '', 0, 0, 5, { title: { layers: [] } }),
      clip('b', 'vid', 5, 0, 4),
    ])]);
    expect(store().slipClip('t', 1)).toBe(0);
    expect(store().slideClip('b', 1)).toBe(1);
    expect(byId('t').sourceOut).toBe(6); // title absorbed (unbounded)
  });
});
