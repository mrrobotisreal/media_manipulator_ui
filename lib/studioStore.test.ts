import { beforeEach, describe, expect, it, vi } from 'vitest';

// Keep the suite hermetic: previewEngine (imported by the store for clip
// geometry) re-exports URL builders that read the active StudioBackend, whose
// module pulls in the auth/analytics stack. None of that is exercised here.
vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached from store unit tests');
  },
}));

import { useStudioStore } from '@/lib/studioStore';
import { STUDIO_SCHEMA_VERSION } from '@/lib/studioTypes';
import type { StudioClip, StudioProject, StudioTrack, StudioTrackKind } from '@/lib/studioTypes';

const clip = (id: string, timelineStart: number, dur: number, extra: Partial<StudioClip> = {}): StudioClip => ({
  id,
  assetId: 'asset-1',
  streamIndex: 0,
  timelineStart,
  sourceIn: 0,
  sourceOut: dur,
  ...extra,
});

const track = (id: string, kind: StudioTrackKind, index: number, clips: StudioClip[]): StudioTrack => ({
  id,
  kind,
  index,
  muted: false,
  clips,
});

const project = (tracks: StudioTrack[]): StudioProject => ({
  id: 'p1',
  name: 'Test project',
  schemaVersion: 2,
  fps: 30,
  width: 1920,
  height: 1080,
  durationSeconds: 0,
  tracks,
  captions: [],
  captionsEnabled: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
});

const store = () => useStudioStore.getState();

/** Load a project with the given tracks (always includes a video + audio lane). */
function load(tracks: StudioTrack[]): void {
  store().loadProject(project(tracks));
}

function trackById(id: string): StudioTrack {
  const t = store().project?.tracks.find((tr) => tr.id === id);
  if (!t) throw new Error(`track ${id} not found`);
  return t;
}

function clipById(id: string): StudioClip {
  const found = store().findClip(id);
  if (!found) throw new Error(`clip ${id} not found`);
  return found.clip;
}

beforeEach(() => {
  store().closeProject();
});

describe('loadProject', () => {
  it('guarantees at least one video and one audio track', () => {
    store().loadProject(project([]));
    const kinds = store().project!.tracks.map((t) => t.kind);
    expect(kinds).toContain('video');
    expect(kinds).toContain('audio');
  });

  it('resets selection, playhead, and dirty flag', () => {
    load([track('v1', 'video', 0, [clip('c1', 0, 5)]), track('a1', 'audio', 0, [])]);
    store().selectClip('c1');
    store().setPlayhead(2);
    store().updateClip('c1', { volume: 0.5 });
    expect(store().dirty).toBe(true);

    load([track('v1', 'video', 0, []), track('a1', 'audio', 0, [])]);
    expect(store().selectedClipIds).toEqual([]);
    expect(store().playhead).toBe(0);
    expect(store().dirty).toBe(false);
  });

  it('stamps the current schema version on v1 projects', () => {
    const v1 = { ...project([]), schemaVersion: 1 };
    store().loadProject(v1);
    expect(store().project!.schemaVersion).toBe(STUDIO_SCHEMA_VERSION);
  });

  it('caches the timeline duration from the loaded tracks', () => {
    load([track('v1', 'video', 0, [clip('c1', 0, 5), clip('c2', 5, 3)]), track('a1', 'audio', 0, [])]);
    expect(store().duration).toBe(8);
  });
});

describe('splitAtPlayhead', () => {
  it('cuts a crossing clip: left keeps the id, right is a new clip starting at the playhead', () => {
    load([track('v1', 'video', 0, [clip('c1', 0, 6)]), track('a1', 'audio', 0, [])]);
    store().setPlayhead(2.5);
    store().splitAtPlayhead();

    const clips = trackById('v1').clips;
    expect(clips).toHaveLength(2);
    const [left, right] = clips;
    expect(left.id).toBe('c1');
    expect(left.timelineStart).toBe(0);
    expect(left.sourceIn).toBe(0);
    expect(left.sourceOut).toBe(2.5);
    expect(right.id).not.toBe('c1');
    expect(right.timelineStart).toBe(2.5);
    expect(right.sourceIn).toBe(2.5);
    expect(right.sourceOut).toBe(6);
    expect(store().dirty).toBe(true);
  });

  it('maps the cut into source time for a trimmed clip', () => {
    // Clip shows source 10..20 starting at timeline 5; cut at timeline 8 → source 13.
    load([track('v1', 'video', 0, [clip('c1', 5, 0, { sourceIn: 10, sourceOut: 20 })]), track('a1', 'audio', 0, [])]);
    store().setPlayhead(8);
    store().splitAtPlayhead();

    const [left, right] = trackById('v1').clips;
    expect(left.sourceOut).toBe(13);
    expect(right.sourceIn).toBe(13);
    expect(right.timelineStart).toBe(8);
  });

  it('selects both halves after the cut', () => {
    load([track('v1', 'video', 0, [clip('c1', 0, 6)]), track('a1', 'audio', 0, [])]);
    store().setPlayhead(3);
    store().splitAtPlayhead();
    const [left, right] = trackById('v1').clips;
    expect(new Set(store().selectedClipIds)).toEqual(new Set([left.id, right.id]));
  });

  it('cuts only selected clips when a selection exists', () => {
    load([
      track('v1', 'video', 0, [clip('c1', 0, 6)]),
      track('a1', 'audio', 0, [clip('c2', 0, 6)]),
    ]);
    store().selectClip('c1');
    store().setPlayhead(3);
    store().splitAtPlayhead();
    expect(trackById('v1').clips).toHaveLength(2);
    expect(trackById('a1').clips).toHaveLength(1);
  });

  it('cuts every crossing clip on every track when nothing is selected', () => {
    load([
      track('v1', 'video', 0, [clip('c1', 0, 6)]),
      track('a1', 'audio', 0, [clip('c2', 0, 6)]),
    ]);
    store().setPlayhead(3);
    store().splitAtPlayhead();
    expect(trackById('v1').clips).toHaveLength(2);
    expect(trackById('a1').clips).toHaveLength(2);
  });

  it('does nothing when the playhead only touches a clip boundary', () => {
    load([track('v1', 'video', 0, [clip('c1', 0, 3), clip('c2', 3, 3)]), track('a1', 'audio', 0, [])]);
    store().setPlayhead(3);
    store().splitAtPlayhead();
    expect(trackById('v1').clips).toHaveLength(2);
    expect(store().dirty).toBe(false);
  });

  it('refuses cuts that would leave a fragment below the minimum clip length', () => {
    load([track('v1', 'video', 0, [clip('c1', 0, 5)]), track('a1', 'audio', 0, [])]);
    store().setPlayhead(0.05); // within the 0.1s margin of the clip start
    store().splitAtPlayhead();
    expect(trackById('v1').clips).toHaveLength(1);
  });
});

describe('deleteSelected (ripple)', () => {
  const tl = () => [
    track('v1', 'video', 0, [clip('a', 0, 5), clip('b', 6, 4), clip('c', 12, 3)]),
    track('a1', 'audio', 0, [clip('m', 0, 20)]),
  ];

  it('shifts later clips left by the duration of the deleted clip', () => {
    load(tl());
    store().selectClip('a');
    store().deleteSelected();
    expect(trackById('v1').clips.map((c) => c.id)).toEqual(['b', 'c']);
    expect(clipById('b').timelineStart).toBe(1); // 6 - 5
    expect(clipById('c').timelineStart).toBe(7); // 12 - 5
  });

  it('shifts by the cumulative duration when multiple clips are deleted', () => {
    load(tl());
    store().selectClip('a');
    store().selectClip('b', true);
    store().deleteSelected();
    expect(trackById('v1').clips.map((c) => c.id)).toEqual(['c']);
    expect(clipById('c').timelineStart).toBe(3); // 12 - (5 + 4)
  });

  it('leaves clips that start before the deleted clip in place', () => {
    load(tl());
    store().selectClip('b');
    store().deleteSelected();
    expect(clipById('a').timelineStart).toBe(0);
    expect(clipById('c').timelineStart).toBe(8); // 12 - 4
  });

  it('does not ripple tracks with no deleted clips', () => {
    load(tl());
    store().selectClip('a');
    store().deleteSelected();
    expect(clipById('m').timelineStart).toBe(0);
  });

  it('clears the selection and is a no-op with nothing selected', () => {
    load(tl());
    store().selectClip('a');
    store().deleteSelected();
    expect(store().selectedClipIds).toEqual([]);

    const before = store().project!.tracks;
    store().deleteSelected();
    expect(store().project!.tracks).toBe(before);
  });
});

describe('moveClip / moveClipToTrack', () => {
  it('nudges a clip into a gap when the order is preserved', () => {
    load([track('v1', 'video', 0, [clip('a', 0, 5), clip('b', 10, 5)]), track('a1', 'audio', 0, [])]);
    store().moveClip('a', 2);
    expect(clipById('a').timelineStart).toBe(2);
    expect(clipById('b').timelineStart).toBe(10); // neighbour untouched
  });

  it('clamps a same-order nudge so clips never overlap', () => {
    load([track('v1', 'video', 0, [clip('a', 0, 5), clip('b', 10, 5)]), track('a1', 'audio', 0, [])]);
    store().moveClip('a', 7); // would overlap b (10..15) → clamped to 5
    expect(clipById('a').timelineStart).toBe(5);
  });

  it('re-packs the track contiguously when a drag crosses a neighbour', () => {
    load([track('v1', 'video', 0, [clip('a', 0, 5), clip('b', 10, 5)]), track('a1', 'audio', 0, [])]);
    store().moveClip('a', 12); // a's center passes b's center → order becomes [b, a]
    expect(clipById('b').timelineStart).toBe(0);
    expect(clipById('a').timelineStart).toBe(5);
  });

  it('clears a cross-dissolve when the reorder re-packs positions', () => {
    load([
      track('v1', 'video', 0, [clip('a', 0, 5), clip('b', 4, 5, { transitionInSeconds: 1 })]),
      track('a1', 'audio', 0, []),
    ]);
    store().moveClip('b', 20); // no reorder (already last) → gap fit, transition cleared
    expect(clipById('b').transitionInSeconds).toBeUndefined();
  });

  it('moves a clip to another track of the same kind and selects it', () => {
    load([
      track('v1', 'video', 0, [clip('a', 0, 5)]),
      track('v2', 'video', 1, []),
      track('a1', 'audio', 0, []),
    ]);
    store().moveClipToTrack('a', 'v2', 3);
    expect(trackById('v1').clips).toHaveLength(0);
    expect(trackById('v2').clips.map((c) => c.id)).toEqual(['a']);
    expect(clipById('a').timelineStart).toBe(3);
    expect(store().selectedClipIds).toEqual(['a']);
  });

  it('avoids overlaps on the target track', () => {
    load([
      track('v1', 'video', 0, [clip('a', 0, 5)]),
      track('v2', 'video', 1, [clip('b', 0, 10)]),
      track('a1', 'audio', 0, []),
    ]);
    store().moveClipToTrack('a', 'v2', 6); // overlaps b's tail → pushed to b's end
    expect(clipById('a').timelineStart).toBe(10);
    expect(clipById('b').timelineStart).toBe(0);
  });
});

describe('addTrack / removeTrack', () => {
  it('appends a new track with the next per-kind index', () => {
    load([track('v1', 'video', 0, []), track('a1', 'audio', 0, [])]);
    store().addTrack('video');
    const videos = store().project!.tracks.filter((t) => t.kind === 'video');
    expect(videos).toHaveLength(2);
    expect(videos.map((t) => t.index).sort()).toEqual([0, 1]);
  });

  it('refuses to remove a track that still has clips', () => {
    load([track('v1', 'video', 0, [clip('a', 0, 5)]), track('a1', 'audio', 0, [])]);
    store().removeTrack('v1');
    expect(trackById('v1').clips).toHaveLength(1);
  });

  it('removes an empty track and renumbers the remaining tracks per kind', () => {
    load([
      track('v1', 'video', 0, []),
      track('v2', 'video', 1, [clip('a', 0, 5)]),
      track('a1', 'audio', 0, []),
    ]);
    store().removeTrack('v1');
    const tracks = store().project!.tracks;
    expect(tracks.find((t) => t.id === 'v1')).toBeUndefined();
    expect(tracks.find((t) => t.id === 'v2')!.index).toBe(0);
    expect(tracks.find((t) => t.id === 'a1')!.index).toBe(0);
  });
});

describe('setClipTransition', () => {
  const twoClips = () => [
    track('v1', 'video', 0, [clip('a', 0, 5), clip('b', 5, 5)]),
    track('a1', 'audio', 0, []),
  ];

  it('pulls the clip left to overlap its predecessor by the transition length', () => {
    load(twoClips());
    store().setClipTransition('b', 1);
    const b = clipById('b');
    expect(b.timelineStart).toBe(4);
    expect(b.transitionInSeconds).toBe(1);
  });

  it('caps the transition at both clip durations and the 4s maximum', () => {
    load([
      track('v1', 'video', 0, [clip('a', 0, 2), clip('b', 2, 10)]),
      track('a1', 'audio', 0, []),
    ]);
    store().setClipTransition('b', 10); // min(2, 10, 4) = 2
    const b = clipById('b');
    expect(b.transitionInSeconds).toBe(2);
    expect(b.timelineStart).toBe(0); // prev end 2 - 2
  });

  it('clears the transition and re-butts the clip at the predecessor end', () => {
    load(twoClips());
    store().setClipTransition('b', 1);
    store().setClipTransition('b', 0);
    const b = clipById('b');
    expect(b.transitionInSeconds).toBeUndefined();
    expect(b.timelineStart).toBe(5);
  });

  it('is a no-op for a clip with no predecessor on its track', () => {
    load(twoClips());
    store().setClipTransition('a', 1);
    const a = clipById('a');
    expect(a.transitionInSeconds).toBeUndefined();
    expect(a.timelineStart).toBe(0);
  });
});

describe('selection semantics', () => {
  it('replaces the selection by default and toggles when additive', () => {
    load([track('v1', 'video', 0, [clip('a', 0, 5), clip('b', 5, 5)]), track('a1', 'audio', 0, [])]);
    store().selectClip('a');
    expect(store().selectedClipIds).toEqual(['a']);

    store().selectClip('b', true);
    expect(new Set(store().selectedClipIds)).toEqual(new Set(['a', 'b']));

    store().selectClip('a', true); // additive toggle removes it
    expect(store().selectedClipIds).toEqual(['b']);

    store().selectClip('a');
    expect(store().selectedClipIds).toEqual(['a']);

    store().selectClip(null);
    expect(store().selectedClipIds).toEqual([]);
  });

  it('clip and caption selection are mutually exclusive', () => {
    load([track('v1', 'video', 0, [clip('a', 0, 5)]), track('a1', 'audio', 0, [])]);
    store().selectClip('a');
    store().selectCaption('cap-1');
    expect(store().selectedClipIds).toEqual([]);
    expect(store().selectedCaptionId).toBe('cap-1');

    store().selectClip('a');
    expect(store().selectedCaptionId).toBeNull();
  });
});

describe('undo/redo history (ADR ui/0001)', () => {
  const base = () => [
    track('v1', 'video', 0, [clip('a', 0, 5), clip('b', 5, 5)]),
    track('a1', 'audio', 0, []),
  ];

  it('undoes and redoes a document mutation', () => {
    load(base());
    store().updateClip('a', { sourceOut: 3 });
    expect(clipById('a').sourceOut).toBe(3);

    store().undo();
    expect(clipById('a').sourceOut).toBe(5);
    store().redo();
    expect(clipById('a').sourceOut).toBe(3);
  });

  it('walks multiple entries in order, both directions', () => {
    load(base());
    store().updateClip('a', { sourceOut: 4 });
    store().updateClip('a', { sourceOut: 3 });
    store().updateClip('a', { sourceOut: 2 });

    store().undo();
    expect(clipById('a').sourceOut).toBe(3);
    store().undo();
    expect(clipById('a').sourceOut).toBe(4);
    store().undo();
    expect(clipById('a').sourceOut).toBe(5);
    expect(store().past).toHaveLength(0);

    store().redo();
    store().redo();
    expect(clipById('a').sourceOut).toBe(3);
    store().redo();
    expect(clipById('a').sourceOut).toBe(2);
    expect(store().future).toHaveLength(0);
  });

  it('a new edit after undo truncates the redo stack', () => {
    load(base());
    store().updateClip('a', { sourceOut: 3 });
    store().undo();
    expect(store().future).toHaveLength(1);

    store().updateClip('a', { sourceOut: 2 });
    expect(store().future).toHaveLength(0);
    store().redo(); // no-op — the old redo branch is gone
    expect(clipById('a').sourceOut).toBe(2);
  });

  it('undo/redo are no-ops on empty stacks', () => {
    load(base());
    const before = store().project;
    store().undo();
    expect(store().project).toBe(before);
    store().redo();
    expect(store().project).toBe(before);
    expect(store().dirty).toBe(false);
  });

  it('caps history at 100 entries, evicting the oldest', () => {
    load(base());
    for (let i = 0; i < 120; i += 1) store().updateClip('a', { volume: (i % 20) / 10 });
    expect(store().past).toHaveLength(100);

    for (let i = 0; i < 200; i += 1) store().undo();
    expect(store().past).toHaveLength(0);
    // 120 edits, 100 remembered → undo bottoms out at the state after edit #19.
    expect(clipById('a').volume).toBe(1.9);
  });

  it('collapses a gesture into a single history entry', () => {
    load(base());
    store().beginGesture();
    for (let i = 1; i <= 5; i += 1) store().updateClip('a', { sourceOut: 5 - i * 0.5 });
    store().endGesture();

    expect(store().past).toHaveLength(1);
    expect(clipById('a').sourceOut).toBe(2.5);
    store().undo();
    expect(clipById('a').sourceOut).toBe(5);
  });

  it('a gesture with no document change records nothing', () => {
    load(base());
    store().beginGesture();
    store().endGesture();
    expect(store().past).toHaveLength(0);

    // Selection inside a gesture is not a document change either.
    store().beginGesture();
    store().selectClip('a');
    store().endGesture();
    expect(store().past).toHaveLength(0);
  });

  it('gestures are re-entrant: only the outermost end commits', () => {
    load(base());
    store().beginGesture();
    store().beginGesture();
    store().updateClip('a', { sourceOut: 3 });
    store().endGesture();
    expect(store().past).toHaveLength(0); // still inside the outer gesture

    store().updateClip('a', { sourceOut: 2 });
    store().endGesture();
    expect(store().past).toHaveLength(1);
    store().undo();
    expect(clipById('a').sourceOut).toBe(5);
  });

  it('ignores undo/redo while a gesture is open', () => {
    load(base());
    store().updateClip('a', { sourceOut: 3 });
    store().beginGesture();
    store().undo();
    expect(clipById('a').sourceOut).toBe(3);
    store().endGesture();
    store().undo();
    expect(clipById('a').sourceOut).toBe(5);
  });

  it('leaves playhead and zoom untouched and keeps still-valid selection', () => {
    load(base());
    store().selectClip('a');
    store().setPlayhead(2);
    store().setZoom(120);
    store().updateClip('a', { sourceOut: 3 });

    store().undo();
    expect(store().playhead).toBe(2);
    expect(store().zoom).toBe(120);
    expect(store().selectedClipIds).toEqual(['a']);
  });

  it('prunes selection ids that do not exist in the restored document', () => {
    load(base());
    store().setPlayhead(2.5);
    store().splitAtPlayhead(); // selects both halves; the right half is a new clip
    expect(store().selectedClipIds.length).toBe(2);

    store().undo(); // right half no longer exists in the restored document
    expect(store().selectedClipIds).toEqual(['a']);
  });

  it('selection, transport, zoom, and asset changes never create history', () => {
    load(base());
    store().selectClip('a');
    store().selectCaption('cap-1');
    store().setPlayhead(1);
    store().play();
    store().pause();
    store().togglePlay();
    store().setZoom(200);
    store().zoomBy(1.25);
    store().setAssets([]);
    expect(store().past).toHaveLength(0);
  });

  it('loadProject resets history', () => {
    load(base());
    store().updateClip('a', { sourceOut: 3 });
    store().undo();
    expect(store().future).toHaveLength(1);

    load(base());
    expect(store().past).toHaveLength(0);
    expect(store().future).toHaveLength(0);
  });

  it('undo/redo mark the document dirty so autosave persists the result; markSaved records nothing', () => {
    load(base());
    store().updateClip('a', { sourceOut: 3 });
    store().markSaved(store().project!);
    expect(store().dirty).toBe(false);
    expect(store().past).toHaveLength(1); // markSaved itself is not undoable

    store().undo();
    expect(store().dirty).toBe(true);

    store().markSaved(store().project!);
    store().redo();
    expect(store().dirty).toBe(true);
  });
});

describe('volume keyframes (mirrors the Go sanitizer)', () => {
  it('sorts, clamps gain to 0..2, and dedupes same-time points (last wins)', () => {
    load([track('v1', 'video', 0, []), track('a1', 'audio', 0, [clip('m', 0, 10)])]);
    // Same shape as TestSanitizeTracks_ClampsAndDrops' keyframe case.
    store().setVolumeKeyframes('m', [
      { t: 5, gain: 3 },
      { t: 1, gain: 0.5 },
      { t: 1, gain: 0.9 },
    ]);
    expect(clipById('m').volumeKeyframes).toEqual([
      { t: 1, gain: 0.9 },
      { t: 5, gain: 2 },
    ]);
  });

  it('stores an empty keyframe list as undefined', () => {
    load([track('v1', 'video', 0, []), track('a1', 'audio', 0, [clip('m', 0, 10, { volumeKeyframes: [{ t: 1, gain: 1 }] })])]);
    store().setVolumeKeyframes('m', []);
    expect(clipById('m').volumeKeyframes).toBeUndefined();
  });

  it('setClipVolume clamps to the 0..2 boost ceiling', () => {
    load([track('v1', 'video', 0, []), track('a1', 'audio', 0, [clip('m', 0, 10)])]);
    store().setClipVolume('m', 5);
    expect(clipById('m').volume).toBe(2);
    store().setClipVolume('m', -1);
    expect(clipById('m').volume).toBe(0);
  });
});

// --- Part 07: save-safety revision (server metadata, outside undo) ----------

describe('revision tracking', () => {
  it('loadProject adopts the server revision; closeProject clears it', () => {
    store().loadProject({ ...project([]), revision: 4 });
    expect(store().revision).toBe(4);
    store().closeProject();
    expect(store().revision).toBeNull();
  });

  it('defaults to null when the backend does not echo a revision (embed legacy)', () => {
    store().loadProject(project([]));
    expect(store().revision).toBeNull();
    expect(store().toSaveRequest()!.expectedRevision).toBeUndefined();
  });

  it('toSaveRequest sends the tracked revision as expectedRevision', () => {
    store().loadProject({ ...project([]), revision: 4 });
    expect(store().toSaveRequest()!.expectedRevision).toBe(4);
  });

  it('markSaved adopts the incremented revision from the save response', () => {
    store().loadProject({ ...project([]), revision: 4 });
    store().markSaved({ ...project([]), revision: 5 });
    expect(store().revision).toBe(5);
    expect(store().dirty).toBe(false);
  });

  it('markSaved keeps the current revision when the response omits one', () => {
    store().loadProject({ ...project([]), revision: 4 });
    store().markSaved(project([]));
    expect(store().revision).toBe(4);
  });

  it('undo never rewinds the revision (it is not part of the document slice)', () => {
    store().loadProject({ ...project([track('v1', 'video', 0, [])]), revision: 4 });
    store().addTrack('video');
    store().markSaved({ ...project([]), revision: 5 });
    store().undo();
    expect(store().revision).toBe(5);
  });
});

// --- Part 08: crash recovery — adopting an IndexedDB draft -------------------

describe('restoreDraft', () => {
  it('replaces the document, marks it dirty, and keeps the tracked revision', () => {
    store().loadProject({ ...project([track('v1', 'video', 0, [])]), revision: 4 });
    const draftDoc = project([track('v1', 'video', 0, [clip('c1', 0, 5)])]);
    store().restoreDraft(draftDoc);
    expect(store().findClip('c1')).not.toBeNull();
    expect(store().dirty).toBe(true); // → the autosave pipeline persists it
    expect(store().revision).toBe(4); // server metadata untouched by recovery
  });

  it('resets undo history (the draft is a fresh baseline)', () => {
    store().loadProject(project([track('v1', 'video', 0, [])]));
    store().addTrack('video');
    expect(store().past.length).toBeGreaterThan(0);
    store().restoreDraft(project([]));
    expect(store().past).toHaveLength(0);
    expect(store().future).toHaveLength(0);
  });

  it('clears selection ids that pointed into the replaced document', () => {
    store().loadProject(project([track('v1', 'video', 0, [clip('c1', 0, 5)])]));
    store().selectClip('c1');
    store().restoreDraft(project([]));
    expect(store().selectedClipIds).toHaveLength(0);
  });

  it('is a no-op when no project is open', () => {
    store().restoreDraft(project([]));
    expect(store().project).toBeNull();
    expect(store().dirty).toBe(false);
  });
});
