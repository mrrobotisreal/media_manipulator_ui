import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached from op tests');
  },
}));

import type { StudioProject } from '@/lib/studioTypes';
import { studioProjectSchema } from '@/lib/studioTypes';
import { lockedViolation } from '@/lib/studioStore';
import { STUDIO_LOOKS, lookEffectId } from '@/lib/studio/looks';
import { LUMETRI_PARAMS } from '@/lib/studio/effectRegistry';

import { applyStudioOps, buildTitleLayers, trackLabel, type StudioOpsContext } from './applyStudio';
import { studioOpsJsonSchema, studioOpsProblems, STUDIO_OP_NAMES } from './studio';
import { STUDIO_FIXTURE_ASSETS, studioFixture } from './studioFixture';

let seq = 0;
const ctx: StudioOpsContext = {
  assetKind: (id) => STUDIO_FIXTURE_ASSETS[id]?.mediaKind,
  assetDuration: (id) => STUDIO_FIXTURE_ASSETS[id]?.durationSeconds,
  lockedViolation,
  newId: () => `n${++seq}`,
};

function run(ops: unknown[], doc: StudioProject = studioFixture()) {
  seq = 0;
  const before = JSON.stringify(doc);
  const r = applyStudioOps(doc, ops, ctx);
  expect(JSON.stringify(doc), 'input untouched').toBe(before);
  return r;
}
function ok(ops: unknown[], doc?: StudioProject): StudioProject {
  const r = run(ops, doc);
  if (!r.ok) throw new Error(r.errors.join('; '));
  expect(studioProjectSchema.safeParse(r.project).success).toBe(true);
  return r.project;
}
const clipOf = (p: StudioProject, id: string) => p.tracks.flatMap((t) => t.clips).find((c) => c.id === id)!;
const trackOf = (p: StudioProject, id: string) => p.tracks.find((t) => t.id === id)!;

describe('studio op schema (MM109)', () => {
  it('names every op the engine handles', () => {
    const items = studioOpsJsonSchema().items as { anyOf: { properties: { op: { const: string } } }[] };
    const names = items.anyOf.map((o) => o.properties.op.const);
    expect(names.sort()).toEqual([...STUDIO_OP_NAMES].sort());
  });

  it('refuses unknown ops, unknown params and out-of-range values with readable reasons', () => {
    expect(studioOpsProblems([{ op: 'make_cinematic' }]).join()).toMatch(/unknown op "make_cinematic"/);
    expect(studioOpsProblems([{ op: 'grade', clipIds: 'all', lumetri: { highlights: -20 } }]).join()).toMatch(/unknown parameter/);
    expect(studioOpsProblems([{ op: 'set_speed', clipId: 'c', speed: 20 }]).join()).toMatch(/> max 10/);
    expect(studioOpsProblems([{ op: 'set_transition', clipId: 'c', type: 'zoomBlur', durationSeconds: 1 }]).join()).toMatch(/not one of/);
    expect(studioOpsProblems([{ op: 'apply_look', clipIds: 'all', lookId: 'sepia' }]).join()).toMatch(/not one of/);
    expect(studioOpsProblems([{ op: 'set_volume', gainDb: 0 }]).join()).toMatch(/exactly one of clipId or track/);
    expect(studioOpsProblems([{ op: 'trim', clipId: 'c' }]).join()).toMatch(/sourceIn or sourceOut/);
    expect(studioOpsProblems([{ op: 'set_caption_style' }]).join()).toMatch(/at least one field/);
    expect(studioOpsProblems([]).join()).toMatch(/< min 1/);
  });

  it('the exported schema states the refinements too (the API refuses the same calls)', () => {
    const text = JSON.stringify(studioOpsJsonSchema());
    expect(text).toContain('"oneOf":[{"required":["clipId"]},{"required":["track"]}]');
    expect(text).toContain('"anyOf":[{"required":["sourceIn"]},{"required":["sourceOut"]}]');
    expect(text).toContain('"anyOf":[{"required":["look"]},{"required":["fontSizePct"]}');
  });
});

describe('studio ops: each op on the fixture (MM109 acceptance 2)', () => {
  it('split: cuts at the time, right piece gets a new id', () => {
    const p = ok([{ op: 'split', clipId: 'clipA', at: 5 }]);
    const v1 = trackOf(p, 'tv1').clips;
    expect(v1).toHaveLength(3);
    expect(clipOf(p, 'clipA').sourceOut).toBe(5);
    expect(v1.find((c) => c.id !== 'clipA' && c.id !== 'clipB')!.timelineStart).toBe(5);
  });
  it('split outside the clip is refused', () => {
    const r = run([{ op: 'split', clipId: 'clipA', at: 30 }]);
    expect(r.ok).toBe(false);
  });
  it('trim: sets source in/out, refuses past the end of the source', () => {
    expect(clipOf(ok([{ op: 'trim', clipId: 'clipA', sourceIn: 2 }]), 'clipA').sourceIn).toBe(2);
    const r = run([{ op: 'trim', clipId: 'clipA', sourceOut: 25 }]);
    expect(r.ok === false && r.errors[0]).toMatch(/past the end of the source/);
  });
  it('move_clip: same track, and onto another track of the same kind by label', () => {
    expect(clipOf(ok([{ op: 'move_clip', clipId: 'clipB', timelineStart: 30 }]), 'clipB').timelineStart).toBe(30);
    const p = ok([{ op: 'move_clip', clipId: 'music1', timelineStart: 2, track: 'A1' }]);
    expect(trackOf(p, 'ta1').clips.some((c) => c.id === 'music1')).toBe(true);
    expect(trackOf(p, 'ta2').clips).toHaveLength(0);
    expect(run([{ op: 'move_clip', clipId: 'music1', timelineStart: 0, track: 'V1' }]).ok).toBe(false);
  });
  it('delete_clip: removes, ripple closes the gap', () => {
    const p = ok([{ op: 'delete_clip', clipId: 'clipA', ripple: true }]);
    expect(trackOf(p, 'tv1').clips.map((c) => [c.id, c.timelineStart])).toEqual([['clipB', 0]]);
    const q = ok([{ op: 'delete_clip', clipId: 'clipA' }]);
    expect(clipOf(q, 'clipB').timelineStart).toBe(12);
  });
  it('set_transition: overlaps the previous clip and writes both fields', () => {
    const c = clipOf(ok([{ op: 'set_transition', clipId: 'clipB', type: 'crossDissolve', durationSeconds: 0.8 }]), 'clipB');
    expect(c.transition).toEqual({ type: 'crossDissolve', durationSeconds: 0.8 });
    expect(c.transitionInSeconds).toBe(0.8);
    expect(c.timelineStart).toBeCloseTo(11.2);
    expect(run([{ op: 'set_transition', clipId: 'clipA', type: 'crossDissolve', durationSeconds: 1 }]).ok).toBe(false);
  });
  it('grade: one Lumetri effect per clip, merged on a second grade; "all" skips audio and titles', () => {
    const p = ok([{ op: 'grade', clipIds: 'all', lumetri: { saturation: 0.8, temperature: 10 } }]);
    for (const id of ['clipA', 'clipB']) {
      const fx = clipOf(p, id).effects!;
      expect(fx).toHaveLength(1);
      expect(fx[0]).toMatchObject({ type: 'lumetri', saturation: 0.8, temperature: 10, contrast: 1 });
    }
    expect(clipOf(p, 'voice1').effects).toBeUndefined();
    const q = ok([{ op: 'grade', clipIds: ['clipA'], lumetri: { contrast: 1.2 } }], p);
    expect(clipOf(q, 'clipA').effects).toHaveLength(1);
    expect(clipOf(q, 'clipA').effects![0]).toMatchObject({ saturation: 0.8, contrast: 1.2 });
    expect(run([{ op: 'grade', clipIds: ['voice1'], lumetri: { contrast: 1.2 } }]).ok).toBe(false);
  });
  it('apply_look: only registry Lumetri params, intensity mixes from neutral, re-applying replaces', () => {
    const p = ok([{ op: 'apply_look', clipIds: 'all', lookId: 'cinematic', intensity: 0.5 }]);
    const fx = clipOf(p, 'clipA').effects!;
    expect(fx).toHaveLength(1);
    expect(fx[0].id).toBe(lookEffectId('cinematic'));
    const keys = Object.keys(fx[0]).filter((k) => !['type', 'id', 'enabled'].includes(k)).sort();
    expect(keys).toEqual(LUMETRI_PARAMS.map((x) => x.key).sort());
    const cine = STUDIO_LOOKS.find((l) => l.id === 'cinematic')!;
    expect((fx[0] as { saturation: number }).saturation).toBeCloseTo(1 + (cine.lumetri.saturation - 1) * 0.5);
    const q = ok([{ op: 'apply_look', clipIds: 'all', lookId: 'noir' }], p);
    expect(clipOf(q, 'clipA').effects!.map((e) => e.id)).toEqual([lookEffectId('noir')]);
  });
  it('set_transform: merges into the clip transform', () => {
    expect(clipOf(ok([{ op: 'set_transform', clipId: 'clipA', scale: 0.3, x: 0.32 }]), 'clipA').transform).toEqual({ x: 0.32, y: 0, scale: 0.3, rotationDeg: 0 });
    expect(run([{ op: 'set_transform', clipId: 'voice1', scale: 2 }]).ok).toBe(false);
  });
  it('set_keyframes: writes the lane (clip-local seconds), volume mirrors the legacy list, effect lanes need the effect', () => {
    const p = ok([{ op: 'set_keyframes', clipId: 'clipA', property: 'scale', keyframes: [{ t: 0, value: 1, ease: 'easeBoth' }, { t: 12, value: 1.15, ease: 'linear' }] }]);
    expect(clipOf(p, 'clipA').keyframes?.scale).toEqual([{ t: 0, value: 1, ease: 'easeBoth' }, { t: 12, value: 1.15, ease: 'linear' }]);
    const v = ok([{ op: 'set_keyframes', clipId: 'music1', property: 'volume', keyframes: [{ t: 0, value: 0, ease: 'easeOut' }, { t: 2, value: 1, ease: 'linear' }] }]);
    expect(clipOf(v, 'music1').volumeKeyframes).toEqual([{ t: 0, gain: 0 }, { t: 2, gain: 1 }]);
    expect(run([{ op: 'set_keyframes', clipId: 'clipA', property: 'fx1.exposure', keyframes: [{ t: 0, value: 1, ease: 'linear' }] }]).ok).toBe(false);
    expect(run([{ op: 'set_keyframes', clipId: 'clipA', property: 'scale', keyframes: [{ t: 0, value: 20, ease: 'linear' }] }]).ok).toBe(false);
    expect(run([{ op: 'set_keyframes', clipId: 'voice1', property: 'opacity', keyframes: [{ t: 0, value: 0, ease: 'linear' }] }]).ok).toBe(false);
  });
  it('add_title lowerThird: lands in the lower 30 % with slide-in keyframes in the first 0.6 s (acceptance 2)', () => {
    const p = ok([{ op: 'add_title', template: 'lowerThird', lines: ['Sam Lee', 'Designer'], start: 2, duration: 5, animateIn: 'slideLeft', animateOut: 'fade' }]);
    const title = p.tracks.flatMap((t) => t.clips).find((c) => c.title)!;
    expect(title.timelineStart).toBe(2);
    expect(title.sourceOut - title.sourceIn).toBe(5);
    for (const l of title.title!.layers) expect((l as { y: number }).y).toBeGreaterThanOrEqual(0.7);
    const pos = title.keyframes!.positionX!;
    expect(pos[0].value).toBeLessThan(0);
    expect(pos.find((k) => k.value === 0)!.t).toBeLessThanOrEqual(0.6);
    expect(title.keyframes!.opacity!.at(-1)).toEqual({ t: 5, value: 0, ease: 'linear' });
    // On top of the picture: a new video track above V1 (V1 holds video at that time).
    const tr = p.tracks.find((t) => t.clips.includes(title))!;
    expect(tr.kind).toBe('video');
    expect(tr.index).toBe(1);
  });
  it('add_title title/endCard/caption are centred or bottom and at most 8 layers', () => {
    for (const template of ['title', 'endCard', 'caption'] as const) {
      const layers = buildTitleLayers(template, ['One', 'Two', 'Three', 'Four'], { backgroundColor: '#000000' }, 1920, 1080);
      expect(layers.length).toBeLessThanOrEqual(8);
    }
    const t = ok([{ op: 'add_title', template: 'title', lines: ['Summer'], start: 0, duration: 3, style: { fontFamily: 'Playfair Display', fontSizePx: 140 } }]);
    const layer = t.tracks.flatMap((x) => x.clips).find((c) => c.title)!.title!.layers[0];
    expect(layer).toMatchObject({ type: 'text', text: 'Summer', fontFamily: 'Playfair Display', fontSizePx: 140, x: 0.5, y: 0.5 });
  });
  it('set_speed: half speed; stills refused', () => {
    expect(clipOf(ok([{ op: 'set_speed', clipId: 'clipB', speed: 0.5, maintainPitch: true }]), 'clipB').speed).toBe(0.5);
  });
  it('freeze_frame: a held frame right after the clip', () => {
    const p = ok([{ op: 'freeze_frame', clipId: 'clipB', at: 14, duration: 2 }]);
    const frame = trackOf(p, 'tv1').clips.find((c) => c.freeze)!;
    expect(frame.timelineStart).toBe(24);
    expect(frame.sourceOut - frame.sourceIn).toBe(2);
    expect(run([{ op: 'freeze_frame', clipId: 'voice1', at: 1, duration: 2 }]).ok).toBe(false);
  });
  it('audio_preset: the preset EQ + compressor on the track', () => {
    const p = ok([{ op: 'audio_preset', track: 'A1', preset: 'podcast' }]);
    expect(trackOf(p, 'ta1').effects?.compressor?.ratio).toBe(4);
    expect(run([{ op: 'audio_preset', track: 'V1', preset: 'podcast' }]).ok).toBe(false);
  });
  it('set_ducking: enables with the voice track', () => {
    const p = ok([{ op: 'set_ducking', enabled: true, voiceTrack: 'A1', amountDb: 12, attackMs: 120, releaseMs: 500 }]);
    expect(p.audio).toMatchObject({ duckingEnabled: true, duckVoiceTrackId: 'ta1', duckAmountDb: 12, duckReleaseMs: 500 });
  });
  it('set_volume: dB → linear on a clip or a track', () => {
    expect(clipOf(ok([{ op: 'set_volume', clipId: 'music1', gainDb: -6 }]), 'music1').volume).toBeCloseTo(0.5012, 3);
    expect(trackOf(ok([{ op: 'set_volume', track: 'A2', gainDb: -12 }]), 'ta2').gain).toBeCloseTo(0.2512, 3);
  });
  it('add_marker: sorted with the default colour', () => {
    const p = ok([{ op: 'add_marker', at: 10, label: 'b-roll here' }, { op: 'add_marker', at: 3, label: 'intro' }]);
    expect(p.markers!.map((m) => [m.t, m.name])).toEqual([[3, 'intro'], [10, 'b-roll here']]);
  });
  it('set_caption_style: needs captions first', () => {
    expect(run([{ op: 'set_caption_style', fontSizePct: 6 }]).ok).toBe(false);
    const withCues = { ...studioFixture(), captions: [{ id: 'c1', startSeconds: 0, endSeconds: 2, text: 'Hi' }] };
    expect(ok([{ op: 'set_caption_style', fontSizePct: 6.5, position: 'bottom' }], withCues).captionStyle?.fontSizePct).toBe(6.5);
  });
  it('set_canvas: vertical preset', () => {
    const p = ok([{ op: 'set_canvas', aspect: '9:16' }]);
    expect([p.width, p.height]).toEqual([1080, 1920]);
  });
});

describe('studio ops: all-or-nothing, ids, locks', () => {
  it('a failing op later in the list changes nothing', () => {
    const r = run([{ op: 'grade', clipIds: 'all', lumetri: { saturation: 0.8 } }, { op: 'split', clipId: 'nope', at: 1 }]);
    expect(r).toMatchObject({ ok: false, reason: 'unknown_id' });
    expect(r.ok === false && r.errors[0]).toMatch(/ops\[1\] split: no clip "nope"/);
  });
  it('an unknown track label is reported', () => {
    expect(run([{ op: 'audio_preset', track: 'A9', preset: 'podcast' }])).toMatchObject({ ok: false, reason: 'unknown_id' });
  });
  it('a locked track refuses the whole batch', () => {
    const doc = studioFixture();
    doc.tracks[0] = { ...doc.tracks[0], locked: true };
    const r = run([{ op: 'add_marker', at: 1, label: 'ok' }, { op: 'set_speed', clipId: 'clipA', speed: 0.5 }], doc);
    expect(r).toMatchObject({ ok: false, reason: 'locked' });
    expect(r.ok === false && r.errors[0]).toMatch(/track V1 is locked/);
  });
  it('"all" never grades a locked track', () => {
    const doc = studioFixture();
    doc.tracks[0] = { ...doc.tracks[0], locked: true };
    expect(run([{ op: 'grade', clipIds: 'all', lumetri: { contrast: 1.1 } }], doc).ok).toBe(false);
  });
  it('trackLabel matches the timeline header names', () => {
    expect(trackLabel({ kind: 'video', index: 0 })).toBe('V1');
    expect(trackLabel({ kind: 'audio', index: 1 })).toBe('A2');
  });
});

describe('set_caption_style with looks and animations (MM121)', () => {
  const withCues = (): StudioProject => ({ ...studioFixture(), captions: [{ id: 'q', startSeconds: 0, endSeconds: 2, text: 'hello there' }] });

  it('a look sets the whole style and lookId; later fields tweak it', () => {
    const p = ok([{ op: 'set_caption_style', look: 'karaoke_classic', highlightColor: '#FF0000' }], withCues());
    expect(p.captionStyle).toMatchObject({ lookId: 'karaoke_classic', animation: 'karaoke_fill', fontFamily: 'Lilita One', highlightColor: '#FF0000' });
  });

  it('accepts the new fields; wordsPerGroup 0 means the whole line', () => {
    const p = ok([{ op: 'set_caption_style', animation: 'pop', animationStrength: 0.9, fontFamily: 'Bangers', uppercase: true, outlineWidth: 6, backgroundMode: 'word_box', position: 'middle', wordsPerGroup: 2 }], withCues());
    expect(p.captionStyle).toMatchObject({ animation: 'pop', fontFamily: 'Bangers', uppercase: true, position: 'middle', wordsPerGroup: 2 });
    const q = ok([{ op: 'set_caption_style', wordsPerGroup: 0 }], p);
    expect(q.captionStyle).not.toHaveProperty('wordsPerGroup');
  });

  it('rejects unknown looks, fonts and animations', () => {
    for (const bad of [{ look: 'vaporwave' }, { fontFamily: 'Comic Sans' }, { animation: 'wobble' }, { outlineWidth: 40 }]) {
      expect(run([{ op: 'set_caption_style', ...bad }], withCues()).ok, JSON.stringify(bad)).toBe(false);
    }
  });

  it('an anonymous editor is refused a locked look or animation with a reason Medi can relay', () => {
    const anon = { ...ctx, signedIn: false };
    const locked = applyStudioOps(withCues(), [{ op: 'set_caption_style', look: 'neon' }], anon);
    expect(locked.ok).toBe(false);
    if (!locked.ok) expect(locked.errors[0]).toMatch(/needs a free account/);
    expect(applyStudioOps(withCues(), [{ op: 'set_caption_style', animation: 'karaoke_fill' }], anon).ok).toBe(false);
    expect(applyStudioOps(withCues(), [{ op: 'set_caption_style', look: 'bold_pop' }], anon).ok).toBe(true);
  });
});

describe('set_caption_words (MM122 decision 5)', () => {
  const timed = (): StudioProject => ({
    ...studioFixture(),
    captions: [{ id: 'q', startSeconds: 0, endSeconds: 2, text: 'big news today', words: [
      { text: 'big', startSeconds: 0, endSeconds: 0.6, emphasis: true },
      { text: 'news', startSeconds: 0.6, endSeconds: 1.2 },
      { text: 'today', startSeconds: 1.2, endSeconds: 2 },
    ] }],
  });
  const premium = { ...ctx, captionWordEdit: true };

  it('Premium: replaces the cue emphasis with the listed words, never times', () => {
    const r = applyStudioOps(timed(), [{ op: 'set_caption_words', cueId: 'q', emphasis: [1, 2] }], premium);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const ws = r.project.captions[0].words!;
    expect(ws.map((w) => !!w.emphasis)).toEqual([false, true, true]);
    expect(ws.map((w) => [w.startSeconds, w.endSeconds])).toEqual(timed().captions[0].words!.map((w) => [w.startSeconds, w.endSeconds]));
    const cleared = applyStudioOps(timed(), [{ op: 'set_caption_words', cueId: 'q', emphasis: [] }], premium);
    expect(cleared.ok && cleared.project.captions[0].words!.every((w) => !w.emphasis)).toBe(true);
  });

  it('Free: refused with a reason that names Premium', () => {
    const r = applyStudioOps(timed(), [{ op: 'set_caption_words', cueId: 'q', emphasis: [1] }], { ...ctx, captionWordEdit: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]).toMatch(/needs Premium/);
  });

  it('refuses an unknown cue, a cue without words, an out-of-range index and any timing field', () => {
    expect(applyStudioOps(timed(), [{ op: 'set_caption_words', cueId: 'zz', emphasis: [0] }], premium).ok).toBe(false);
    const plain = { ...timed(), captions: [{ id: 'q', startSeconds: 0, endSeconds: 2, text: 'no words' }] };
    expect(applyStudioOps(plain, [{ op: 'set_caption_words', cueId: 'q', emphasis: [0] }], premium).ok).toBe(false);
    expect(applyStudioOps(timed(), [{ op: 'set_caption_words', cueId: 'q', emphasis: [3] }], premium).ok).toBe(false);
    expect(studioOpsProblems([{ op: 'set_caption_words', cueId: 'q', emphasis: [0], startSeconds: 1 }])).not.toEqual([]);
    expect(STUDIO_OP_NAMES).toContain('set_caption_words');
  });
});
