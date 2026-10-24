import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached from store unit tests');
  },
}));

import { useStudioStore } from '@/lib/studioStore';
import type { StudioAsset, StudioClip, StudioProject, StudioTrack } from '@/lib/studioTypes';

const store = () => useStudioStore.getState();

const clip = (id: string, assetId: string, start: number, dur: number): StudioClip => ({
  id,
  assetId,
  streamIndex: 0,
  timelineStart: start,
  sourceIn: 0,
  sourceOut: dur,
});

const track = (id: string, kind: 'video' | 'audio', index: number, clips: StudioClip[]): StudioTrack => ({
  id, kind, index, muted: false, clips,
});

const project = (tracks: StudioTrack[]): StudioProject => ({
  id: 'p1', name: 'T', schemaVersion: 2, fps: 30, width: 1920, height: 1080, durationSeconds: 0,
  tracks, captions: [], captionsEnabled: true,
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
});

const asset = (id: string, extra: Partial<StudioAsset> = {}): StudioAsset => ({
  id, projectId: 'p1', originalFileName: `${id}.mp4`, s3KeyOriginal: id, mediaKind: 'video',
  durationSeconds: 4, hasAudio: true, probeJson: null, createdAt: '2026-01-01T00:00:00Z', ...extra,
});

beforeEach(() => {
  store().closeProject();
});

describe('bin organization state (not undoable)', () => {
  it('patchAssetMeta updates the asset entry and leaves history alone', () => {
    store().loadProject(project([]));
    store().setAssets([asset('a')]);
    store().patchAssetMeta('a', { displayName: 'Intro', folder: 'B-roll', label: 'red' });
    expect(store().assets.a.asset).toMatchObject({ displayName: 'Intro', folder: 'B-roll', label: 'red' });
    expect(store().past).toHaveLength(0);
    // Empty string clears.
    store().patchAssetMeta('a', { label: '' });
    expect(store().assets.a.asset.label).toBeUndefined();
    store().undo();
    expect(store().assets.a.asset.folder).toBe('B-roll');
  });

  it('setAssets marks the bin loaded; closeProject resets it', () => {
    expect(store().assetsLoaded).toBe(false);
    store().setAssets([]);
    expect(store().assetsLoaded).toBe(true);
    store().closeProject();
    expect(store().assetsLoaded).toBe(false);
  });
});

describe('usage-protected delete', () => {
  it('removes every referencing clip as ONE undo entry, and undo brings them back', () => {
    store().loadProject(project([
      track('v', 'video', 0, [clip('c1', 'a', 0, 2), clip('c2', 'b', 2, 2), clip('c3', 'a', 4, 2)]),
      track('au', 'audio', 0, [clip('c4', 'a', 0, 2)]),
    ]));
    store().setAssets([asset('a'), asset('b')]);
    const removed = store().removeClipsForAssets(['a']);
    expect(removed).toBe(3);
    expect(store().past).toHaveLength(1);
    const left = store().project!.tracks.flatMap((t) => t.clips.map((c) => c.id));
    expect(left).toEqual(['c2']);
    // No ripple: the survivor keeps its position.
    expect(store().findClip('c2')!.clip.timelineStart).toBe(2);

    store().removeAssetEntries(['a']);
    expect(Object.keys(store().assets)).toEqual(['b']);

    store().undo();
    const back = store().project!.tracks.flatMap((t) => t.clips.map((c) => c.id)).sort();
    expect(back).toEqual(['c1', 'c2', 'c3', 'c4']);
    // The clips now reference a dead asset: the offline guard's input condition.
    expect(store().assets.a).toBeUndefined();
  });

  it('records no history when nothing references the asset', () => {
    store().loadProject(project([track('v', 'video', 0, [clip('c1', 'b', 0, 2)])]));
    expect(store().removeClipsForAssets(['a'])).toBe(0);
    expect(store().past).toHaveLength(0);
  });
});

describe('voiceover placement', () => {
  const vo = asset('vo', { mediaKind: 'audio', durationSeconds: 3, hasAudio: true });

  it('lands at the playhead on the first audio track with room', () => {
    store().loadProject(project([track('au', 'audio', 0, [])]));
    store().setAssets([vo]);
    store().setPlayhead(5);
    store().placeAssetAtPlayhead('vo');
    const c = store().project!.tracks.find((t) => t.id === 'au')!.clips[0];
    expect(c).toMatchObject({ assetId: 'vo', timelineStart: 5, sourceIn: 0, sourceOut: 3 });
    expect(store().past).toHaveLength(1);
  });

  it('creates a new audio track when every existing one is occupied at that time', () => {
    store().loadProject(project([track('au', 'audio', 0, [clip('x', 'vo', 4, 4)])]));
    store().setAssets([vo]);
    store().placeAssetAtPlayhead('vo', 5);
    const audio = store().project!.tracks.filter((t) => t.kind === 'audio');
    expect(audio).toHaveLength(2);
    expect(audio[1].clips[0].timelineStart).toBe(5);
    expect(audio[1].index).toBe(1);
  });

  it('prefers a lower track that is free over creating one', () => {
    store().loadProject(project([
      track('a1', 'audio', 0, [clip('x', 'vo', 0, 10)]),
      track('a2', 'audio', 1, []),
    ]));
    store().setAssets([vo]);
    store().placeAssetAtPlayhead('vo', 2);
    expect(store().project!.tracks.filter((t) => t.kind === 'audio')).toHaveLength(2);
    expect(store().project!.tracks.find((t) => t.id === 'a2')!.clips).toHaveLength(1);
  });
});
