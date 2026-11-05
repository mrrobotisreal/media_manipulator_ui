import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached from store unit tests');
  },
}));

import { useStudioStore } from '@/lib/studioStore';
import { STUDIO_FIXTURE_ASSETS, studioFixture } from '@/lib/assistant/ops/studioFixture';
import type { StudioAsset } from '@/lib/studioTypes';

const store = () => useStudioStore.getState();

function load(locked = false) {
  const p = studioFixture();
  if (locked) p.tracks[0] = { ...p.tracks[0], locked: true };
  store().loadProject(p);
  store().setAssets(
    Object.entries(STUDIO_FIXTURE_ASSETS).map(
      ([id, a]) => ({ id, projectId: 'proj-1', originalFileName: a.name, s3KeyOriginal: id, mediaKind: a.mediaKind, durationSeconds: a.durationSeconds, hasAudio: a.mediaKind !== 'image', probeJson: {}, createdAt: '' }) as StudioAsset,
    ),
  );
}

beforeEach(() => store().closeProject());

describe('applyAssistantOps (MM109 decision 1)', () => {
  it('records exactly ONE history entry labelled "Medi|<summary>"; Undo restores the project byte for byte', () => {
    load();
    const before = JSON.stringify(store().project);
    const pastBefore = store().past.length;
    const res = store().applyAssistantOps('Cinematic grade', [
      { op: 'apply_look', clipIds: 'all', lookId: 'cinematic', intensity: 0.8 },
      { op: 'add_title', template: 'lowerThird', lines: ['Sam Lee'], start: 2, duration: 4, animateIn: 'slideLeft' },
      { op: 'set_ducking', enabled: true, voiceTrack: 'A1' },
    ]);
    expect(res.ok).toBe(true);
    expect(store().past.length).toBe(pastBefore + 1);
    expect(store().future).toEqual([]);
    expect(store().dirty).toBe(true);
    expect(store().undoLabel()).toBe('Medi|Cinematic grade');
    store().undo();
    expect(JSON.stringify(store().project)).toBe(before);
    expect(store().redoLabel()).toBe('Medi|Cinematic grade');
    store().redo();
    expect(store().undoLabel()).toBe('Medi|Cinematic grade');
  });

  it('an unlabelled user edit after a Medi undo is not mislabelled', () => {
    load();
    store().applyAssistantOps('Marker', [{ op: 'add_marker', at: 1, label: 'x' }]);
    store().undo();
    store().addMarker(5);
    expect(store().undoLabel()).toBeUndefined();
  });

  it('a locked track refuses the whole batch and leaves history alone', () => {
    load(true);
    const before = store().project;
    const res = store().applyAssistantOps('Slow mo', [{ op: 'add_marker', at: 1, label: 'x' }, { op: 'set_speed', clipId: 'clipA', speed: 0.5 }]);
    expect(res).toMatchObject({ ok: false, reason: 'locked' });
    expect(store().project).toBe(before);
    expect(store().past).toHaveLength(0);
  });

  it('an invalid or no-op batch changes nothing', () => {
    load();
    const before = store().project;
    expect(store().applyAssistantOps('x', [{ op: 'split', clipId: 'nope', at: 3 }])).toMatchObject({ ok: false, reason: 'unknown_id' });
    expect(store().applyAssistantOps('x', [{ op: 'set_canvas', aspect: '16:9' }]).ok).toBe(false);
    expect(store().project).toBe(before);
    expect(store().past).toHaveLength(0);
  });

  it('is refused while the user is dragging (a gesture is open), and never resets history', () => {
    load();
    store().addMarker(3);
    store().beginGesture();
    expect(store().applyAssistantOps('x', [{ op: 'add_marker', at: 1, label: 'x' }])).toMatchObject({ ok: false, reason: 'locked' });
    store().endGesture();
    store().applyAssistantOps('Marker', [{ op: 'add_marker', at: 1, label: 'x' }]);
    expect(store().past).toHaveLength(2);
  });

  it('reads the media bin: a still image clip cannot be retimed', () => {
    const p = studioFixture();
    p.tracks[0].clips.push({ id: 'img1', assetId: 'still', streamIndex: 0, timelineStart: 30, sourceIn: 0, sourceOut: 5 });
    store().loadProject(p);
    store().setAssets(
      Object.entries(STUDIO_FIXTURE_ASSETS).map(
        ([id, a]) => ({ id, projectId: 'proj-1', originalFileName: a.name, s3KeyOriginal: id, mediaKind: a.mediaKind, durationSeconds: a.durationSeconds, hasAudio: false, probeJson: {}, createdAt: '' }) as StudioAsset,
      ),
    );
    expect(store().applyAssistantOps('x', [{ op: 'set_speed', clipId: 'img1', speed: 2 }]).ok).toBe(false);
    expect(store().applyAssistantOps('x', [{ op: 'set_speed', clipId: 'clipA', speed: 2 }]).ok).toBe(true);
  });
});
