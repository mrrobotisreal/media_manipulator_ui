/**
 * MM109: the Darkroom adapter against the real store. One undo entry per apply, Undo restores
 * the previous project byte for byte, never loadProject/restoreDraft, locked tracks refuse the
 * whole batch, the undo token never undoes the user's own later work, suggested actions run only
 * when clicked, and the "what I changed" lines are templated keys.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached from adapter tests');
  },
}));

import { useStudioStore } from '@/lib/studioStore';
import type { StudioAsset } from '@/lib/studioTypes';
import { STUDIO_FIXTURE_ASSETS, studioFixture } from '@/lib/assistant/ops/studioFixture';

import { STUDIO_VISUAL_OPS, createStudioAdapter, describeStudioOps } from './studio';

const t = (key: string, vars?: Record<string, unknown>) => (vars ? `${key}${JSON.stringify(vars)}` : key);

function setup(locked = false) {
  const st = useStudioStore.getState();
  st.closeProject();
  const p = studioFixture();
  if (locked) p.tracks[0] = { ...p.tracks[0], locked: true };
  st.loadProject(p);
  st.setAssets(
    Object.entries(STUDIO_FIXTURE_ASSETS).map(
      ([id, a]) => ({ id, projectId: 'proj-1', originalFileName: a.name, s3KeyOriginal: id, mediaKind: a.mediaKind, durationSeconds: a.durationSeconds, hasAudio: false, probeJson: {}, createdAt: '' }) as StudioAsset,
    ),
  );
  const spies = { onGenerateCaptions: vi.fn(), onDeriveAudio: vi.fn(), onVoiceover: vi.fn(), onExport: vi.fn(), onOpenTool: vi.fn() };
  const adapter = createStudioAdapter({ store: useStudioStore, t, captureFrame: async () => null, projectId: () => 'proj-1', ...spies });
  return { adapter, spies };
}
const store = () => useStudioStore.getState();

beforeEach(() => store().closeProject());

describe('Darkroom adapter (MM109)', () => {
  it('applies as exactly one undo entry; Undo restores the project byte for byte', () => {
    const { adapter } = setup();
    store().addMarker(20);
    const before = JSON.stringify(store().project);
    const pastBefore = store().past.length;
    const r = adapter.apply('Cinematic grade', [
      { op: 'apply_look', clipIds: 'all', lookId: 'cinematic', intensity: 0.8 },
      { op: 'add_title', template: 'lowerThird', lines: ['Sam Lee'], start: 2, duration: 4, animateIn: 'slideLeft' },
    ]);
    expect(r.ok).toBe(true);
    expect(store().past.length).toBe(pastBefore + 1);
    expect(store().undoLabel()).toBe('Medi|Cinematic grade');
    if (!r.ok) return;
    expect(r.opKinds).toEqual(['apply_look', 'add_title']);
    expect(r.changes).toEqual([
      'assistant.copilot.studio.change.look{"look":"contentStudio.looks.cinematic","clips":"assistant.copilot.studio.allClips"}',
      'assistant.copilot.studio.change.title.lowerThird{"at":2}',
    ]);
    expect(adapter.canUndo(r.token)).toBe(true);
    expect(adapter.undo(r.token)).toBe(true);
    expect(JSON.stringify(store().project)).toBe(before);
    expect(store().past.length).toBe(pastBefore);
    expect(adapter.undo(r.token)).toBe(false);
  });

  it('the undo token never undoes the user’s own later edit', () => {
    const { adapter } = setup();
    const r = adapter.apply('Marker', [{ op: 'add_marker', at: 3, label: 'x' }]);
    if (!r.ok) throw new Error('apply failed');
    store().addMarker(9);
    expect(adapter.canUndo(r.token)).toBe(false);
    expect(adapter.undo(r.token)).toBe(false);
    expect(store().project!.markers).toHaveLength(2);
  });

  it('a locked track refuses the whole batch and records no history', () => {
    const { adapter } = setup(true);
    const doc = store().project;
    const r = adapter.apply('x', [{ op: 'add_marker', at: 1, label: 'ok' }, { op: 'grade', clipIds: ['clipA'], lumetri: { contrast: 1.1 } }]);
    expect(r).toMatchObject({ ok: false, reason: 'locked' });
    expect(store().project).toBe(doc);
    expect(store().past).toHaveLength(0);
  });

  it('an unknown id is rejected with the reason the client reports', () => {
    const { adapter } = setup();
    expect(adapter.apply('x', [{ op: 'split', clipId: 'ghost', at: 2 }])).toMatchObject({ ok: false, reason: 'unknown_id' });
  });

  it('never calls loadProject, restoreDraft or closeProject (they clear history)', () => {
    const src = readFileSync(join(__dirname, 'studio.ts'), 'utf8');
    expect(src).not.toMatch(/\.(loadProject|restoreDraft|closeProject)\(/);
  });

  it('the digest names the timeline by label and id', () => {
    const { adapter } = setup();
    const d = adapter.digest();
    expect(d).toContain('track V1 (video)');
    expect(d).toContain('clipB · 12–24s · video "city.mp4"');
  });

  it('suggested actions call nothing until the button runs them, then only that flow', async () => {
    const { adapter, spies } = setup();
    for (const s of Object.values(spies)) expect(s).not.toHaveBeenCalled();
    await adapter.suggest.generate_captions!({ language: 'de' });
    expect(spies.onGenerateCaptions).toHaveBeenCalledWith('de');
    await adapter.suggest.derive_audio!({ clipId: 'voice1', operation: 'voice_clean' });
    expect(spies.onDeriveAudio).toHaveBeenCalledWith('voice1', 'voice_clean');
    await adapter.suggest.derive_audio!({ operation: 'rm -rf' });
    expect(spies.onDeriveAudio).toHaveBeenLastCalledWith(null, 'voice_clean');
    adapter.suggest.voiceover!({ text: 'Welcome back' });
    expect(spies.onVoiceover).toHaveBeenCalledWith('Welcome back');
    adapter.suggest.export!({});
    expect(spies.onExport).toHaveBeenCalledTimes(1);
  });

  it('verify frames only after visual ops', () => {
    const { adapter } = setup();
    expect(adapter.isVisual?.([{ op: 'apply_look' }])).toBe(true);
    expect(adapter.isVisual?.([{ op: 'set_ducking' }, { op: 'add_marker' }])).toBe(false);
    for (const op of ['grade', 'apply_look', 'add_title', 'set_transform', 'set_canvas']) expect(STUDIO_VISUAL_OPS.has(op)).toBe(true);
  });

  it('describes every op with a templated key', () => {
    const p = studioFixture();
    const lines = describeStudioOps(
      [
        { op: 'split', clipId: 'clipA', at: 4 },
        { op: 'set_volume', track: 'a2', gainDb: -6 },
        { op: 'audio_preset', track: 'A1', preset: 'podcast' },
        { op: 'set_canvas', aspect: '9:16' },
      ],
      p,
      t,
    );
    expect(lines).toEqual([
      'assistant.copilot.studio.change.split{"clip":"V1 0s","at":4}',
      'assistant.copilot.studio.change.volume{"target":"A2","db":-6}',
      'assistant.copilot.studio.change.audioPreset{"preset":"contentStudio.mixer.preset.podcast","track":"A1"}',
      'assistant.copilot.studio.change.canvas{"aspect":"9:16"}',
    ]);
  });
});
