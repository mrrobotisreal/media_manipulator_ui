'use client';

import { useStudioStore } from '@/lib/studioStore';
import { editSummary } from '@/lib/studio/telemetry';
import { defaultTransitionSeconds } from '@/lib/studio/preferences';
import type { CommandId } from '@/lib/studio/keymap';

/**
 * Command dispatcher (Darkroom v3 part 18): the ONE place a keymap command id
 * turns into store calls + edit-summary counters. The window keydown handler
 * (source 'shortcut') and the UI affordances — tool palette, track headers,
 * context menus (source 'ui') — both call `runCommand`, so shortcut-vs-UI
 * attribution is recorded identically everywhere (roadmap rule 11).
 *
 * A command that turns out to be a no-op (nothing to split, empty undo stack,
 * tool already active) counts nothing. `repeat` presses (key held down) run but
 * are not counted again.
 */
export type CommandSource = 'shortcut' | 'ui';

const TOOL_BY_COMMAND = {
  'tool.select': 'select',
  'tool.razor': 'razor',
  'tool.slip': 'slip',
  'tool.slide': 'slide',
  'tool.hand': 'hand',
} as const;

export function runCommand(command: CommandId, source: CommandSource, opts: { repeat?: boolean } = {}): boolean {
  const st = useStudioStore.getState();
  if (!st.project) return false;
  const count = (extra?: () => void) => {
    if (opts.repeat) return;
    extra?.();
    editSummary.increment(source === 'shortcut' ? 'shortcutInvocations' : 'uiInvocations');
  };
  const fps = Math.max(1, st.project.fps || 30);

  switch (command) {
    case 'tool.select':
    case 'tool.razor':
    case 'tool.slip':
    case 'tool.slide':
    case 'tool.hand': {
      const mode = TOOL_BY_COMMAND[command];
      if (st.toolMode === mode) return false;
      st.setToolMode(mode);
      count(() => editSummary.increment('toolSwitches'));
      return true;
    }
    case 'edit.split': {
      const before = st.project;
      st.splitAtPlayhead();
      if (useStudioStore.getState().project === before) return false;
      count(() => editSummary.increment('splits'));
      return true;
    }
    case 'edit.toggleSnapping':
      st.toggleSnapping();
      count();
      return true;
    case 'edit.rippleTrimPrev':
    case 'edit.rippleTrimNext': {
      const n = st.rippleTrimToPlayhead(command === 'edit.rippleTrimPrev' ? 'prev' : 'next');
      if (n === 0) return false;
      count(() => editSummary.increment('trimsRipple'));
      return true;
    }
    case 'edit.rippleDelete': {
      if (st.selectedMarkerId && st.selectedClipIds.length === 0) {
        st.removeMarker(st.selectedMarkerId);
        count();
        return true;
      }
      const before = st.project;
      st.deleteSelected();
      if (useStudioStore.getState().project === before) return false;
      count();
      return true;
    }
    case 'edit.defaultTransition': {
      const clipId = st.selectedClipIds.length === 1 ? st.selectedClipIds[0] : null;
      const found = clipId ? st.findClip(clipId) : null;
      if (!found) return false;
      const hasPrev = found.track.clips.some((c) => c.id !== found.clip.id && c.timelineStart < found.clip.timelineStart);
      if (!hasPrev) return false;
      const before = st.project;
      st.setClipTransition(found.clip.id, {
        type: 'crossDissolve',
        durationSeconds: defaultTransitionSeconds(found.track.kind),
      });
      if (useStudioStore.getState().project === before) return false;
      count(() => editSummary.increment('transitionsAdded', 'crossDissolve'));
      return true;
    }
    case 'edit.addTitle': {
      const before = st.project;
      st.addTitleClip();
      if (useStudioStore.getState().project === before) return false;
      count(() => editSummary.increment('titlesAdded'));
      return true;
    }
    case 'edit.group': {
      if (!st.groupClips(st.selectedClipIds)) return false;
      count(() => editSummary.increment('clipsGrouped'));
      return true;
    }
    case 'edit.ungroup': {
      if (!st.ungroupClips(st.selectedClipIds)) return false;
      count(() => editSummary.increment('clipsGrouped'));
      return true;
    }
    case 'edit.detachAudio': {
      const id = st.selectedClipIds.length === 1 ? st.selectedClipIds[0] : null;
      if (!id || !st.detachAudio(id)) return false;
      count(() => editSummary.increment('audioDetached'));
      return true;
    }
    case 'marker.add': {
      if (!st.addMarker()) return false;
      count(() => editSummary.increment('markersAdded'));
      return true;
    }
    case 'view.toggleMarkersPanel':
      st.setMarkersPanelOpen(!st.markersPanelOpen);
      count();
      return true;
    case 'view.zoomIn':
      st.zoomBy(1.25);
      count();
      return true;
    case 'view.zoomOut':
      st.zoomBy(1 / 1.25);
      count();
      return true;
    case 'view.cheatSheet':
      st.setCheatSheetOpen(!st.cheatSheetOpen);
      count();
      return true;
    case 'history.undo':
      if (st.past.length === 0) return false;
      st.undo();
      count(() => editSummary.increment('undoCount'));
      return true;
    case 'history.redo':
      if (st.future.length === 0) return false;
      st.redo();
      count(() => editSummary.increment('redoCount'));
      return true;
    case 'transport.playPause':
      st.togglePlay();
      count();
      return true;
    case 'transport.stepBack':
      st.pause();
      st.setPlayhead(st.playhead - 1 / fps);
      count();
      return true;
    case 'transport.stepForward':
      st.pause();
      st.setPlayhead(st.playhead + 1 / fps);
      count();
      return true;
  }
}
