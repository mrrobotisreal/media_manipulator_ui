import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached from unit tests');
  },
}));

import { analytics, EVENTS } from '@/lib/analytics';
import { useStudioStore } from '@/lib/studioStore';
import { flushStudioTelemetry, resetStudioTelemetryForTests } from './telemetry';
import { runCommand } from './commands';
import type { StudioAsset, StudioProject } from '@/lib/studioTypes';

const store = () => useStudioStore.getState();
let tracked: { name: string; props: Record<string, unknown> }[];

const asset: StudioAsset = {
  id: 'vid', projectId: 'p1', originalFileName: 'v.mp4', s3KeyOriginal: 'v', mediaKind: 'video',
  durationSeconds: 30, hasAudio: true, probeJson: null, createdAt: '2026-01-01T00:00:00Z',
};
const proj = (): StudioProject => ({
  id: 'p1', name: 'T', schemaVersion: 3, fps: 30, width: 1920, height: 1080, durationSeconds: 0,
  tracks: [
    { id: 'v', kind: 'video', index: 0, muted: false, clips: [
      { id: 'a', assetId: 'vid', streamIndex: 0, timelineStart: 0, sourceIn: 0, sourceOut: 10 },
      { id: 'b', assetId: 'vid', streamIndex: 0, timelineStart: 12, sourceIn: 0, sourceOut: 4 },
    ] },
    { id: 'au', kind: 'audio', index: 0, muted: false, clips: [] },
  ],
  captions: [], captionsEnabled: true, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
});

beforeEach(() => {
  vi.useFakeTimers();
  tracked = [];
  vi.spyOn(analytics, 'track').mockImplementation(((name: string, props: unknown) => {
    tracked.push({ name, props: (props ?? {}) as Record<string, unknown> });
  }) as typeof analytics.track);
  vi.spyOn(analytics, 'flushSync').mockImplementation(() => {});
  store().closeProject();
  store().loadProject(proj());
  store().setAssets([asset]);
});
afterEach(() => {
  resetStudioTelemetryForTests();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const summary = (): Record<string, unknown> => {
  flushStudioTelemetry();
  return tracked.find((c) => c.name === EVENTS.STUDIO_EDIT_SUMMARY)?.props ?? {};
};

describe('runCommand: attribution + counters', () => {
  it('tool switch counts toolSwitches and shortcut vs UI separately', () => {
    expect(runCommand('tool.razor', 'shortcut')).toBe(true);
    expect(runCommand('tool.slip', 'ui')).toBe(true);
    expect(store().toolMode).toBe('slip');
    const s = summary();
    expect(s.toolSwitches).toBeDefined();
    expect(s.shortcutInvocations).toBeDefined();
    expect(s.uiInvocations).toBeDefined();
  });

  it('re-selecting the active tool is a no-op and counts nothing', () => {
    expect(runCommand('tool.select', 'shortcut')).toBe(false);
    expect(summary().toolSwitches).toBeUndefined();
  });

  it('split counts only when something was cut', () => {
    store().setPlayhead(11);
    expect(runCommand('edit.split', 'shortcut')).toBe(false); // gap
    expect(summary().splits).toBeUndefined();
    store().setPlayhead(5);
    expect(runCommand('edit.split', 'shortcut')).toBe(true);
    expect(summary().splits).toBeDefined();
  });

  it('marker add counts markersAdded; delete of the selected marker is routed through Del', () => {
    store().setPlayhead(3);
    expect(runCommand('marker.add', 'shortcut')).toBe(true);
    expect(store().project!.markers).toHaveLength(1);
    store().selectClip(null);
    store().selectMarker(store().project!.markers![0].id);
    expect(runCommand('edit.rippleDelete', 'shortcut')).toBe(true);
    expect(store().project!.markers).toBeUndefined();
    expect(summary().markersAdded).toBeDefined();
  });

  it('group / detach / ripple-trim counters', () => {
    store().selectClip('a');
    store().selectClip('b', true);
    expect(runCommand('edit.group', 'shortcut')).toBe(true);
    store().selectClip(null);
    store().selectClip('a');
    expect(runCommand('edit.ungroup', 'shortcut')).toBe(true);
    store().selectClip(null);
    store().selectClip('b');
    expect(runCommand('edit.detachAudio', 'ui')).toBe(true);
    store().selectClip(null);
    store().selectClip('a');
    store().setPlayhead(5);
    expect(runCommand('edit.rippleTrimNext', 'shortcut')).toBe(true);
    const s = summary();
    expect(s.clipsGrouped).toBeDefined();
    expect(s.audioDetached).toBeDefined();
    expect(s.trimsRipple).toBeDefined();
  });

  it('auto-repeat runs but does not inflate the counters', () => {
    runCommand('view.zoomIn', 'shortcut', { repeat: true });
    expect(summary().shortcutInvocations).toBeUndefined();
  });

  it('undo with an empty stack is a no-op; the cheat sheet toggles', () => {
    expect(runCommand('history.undo', 'shortcut')).toBe(false);
    runCommand('view.cheatSheet', 'shortcut');
    expect(store().cheatSheetOpen).toBe(true);
    runCommand('view.cheatSheet', 'shortcut');
    expect(store().cheatSheetOpen).toBe(false);
  });

  it('does nothing without a project', () => {
    store().closeProject();
    expect(runCommand('tool.razor', 'shortcut')).toBe(false);
  });

  it('a locked-track split is refused and leaves the document untouched', () => {
    store().toggleTrackLock('v');
    const doc = store().project;
    store().setPlayhead(5);
    expect(runCommand('edit.split', 'shortcut')).toBe(false);
    expect(store().project).toBe(doc);
  });
});
