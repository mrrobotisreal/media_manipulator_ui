import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached from store unit tests');
  },
}));

import { useStudioStore } from '@/lib/studioStore';
import type { StudioProject } from '@/lib/studioTypes';

const store = () => useStudioStore.getState();
const project = (): StudioProject => ({
  id: 'p1', name: 'T', schemaVersion: 3, fps: 30, width: 1920, height: 1080, durationSeconds: 0,
  tracks: [
    {
      id: 'v', kind: 'video', index: 0, muted: false,
      clips: [{
        id: 'c1', assetId: 'a', timelineStart: 0, sourceIn: 0, sourceOut: 4,
        transform: { x: 0.25, y: -0.1, scale: 0.8, rotation: 12 },
      } as unknown as StudioProject['tracks'][number]['clips'][number]],
    },
  ],
  captions: [], captionsEnabled: true,
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
});

beforeEach(() => {
  store().closeProject();
  store().loadProject(project());
});

describe('setCanvas (part 20)', () => {
  it('changes width/height, marks dirty and is ONE undo entry', () => {
    const before = store().past.length;
    store().setCanvas(1080, 1920);
    expect(store().project).toMatchObject({ width: 1080, height: 1920 });
    expect(store().dirty).toBe(true);
    expect(store().past.length).toBe(before + 1);
  });

  it('leaves every clip untouched (no transform mutation, same object identity)', () => {
    const clipBefore = store().project!.tracks[0].clips[0];
    const tracksBefore = store().project!.tracks;
    store().setCanvas(1080, 1080);
    expect(store().project!.tracks).toBe(tracksBefore);
    expect(store().project!.tracks[0].clips[0]).toBe(clipBefore);
  });

  it('is undoable and redoable', () => {
    store().setCanvas(1080, 1350);
    store().undo();
    expect(store().project).toMatchObject({ width: 1920, height: 1080 });
    store().redo();
    expect(store().project).toMatchObject({ width: 1080, height: 1350 });
  });

  it('clamps to the server range and evens odd values', () => {
    store().setCanvas(99999, 99999);
    expect(store().project).toMatchObject({ width: 7680, height: 4320 });
    store().setCanvas(1081, 1081);
    expect(store().project).toMatchObject({ width: 1080, height: 1080 });
  });

  it('is a true no-op for an unchanged size (no history entry)', () => {
    const before = store().past.length;
    store().setCanvas(1920, 1080);
    expect(store().past.length).toBe(before);
  });
});
