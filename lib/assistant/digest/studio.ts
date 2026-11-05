/**
 * MM109: the Darkroom timeline digest Medi reads (design MEDI_ASSISTANT.md §9.1, ticket decision 4).
 *
 * Compact text the model references by id: canvas/fps/duration, every track with its label
 * (V1, A2… — the label ops address it by) and flags, every clip as
 * `id · start–end · source name/kind · effects/look/transition/speed/keyframes`, title text,
 * markers, captions, the ducking setup, the playhead and the selection. Deterministic (no dates,
 * nothing invented) and bounded (~4k tokens): when it would exceed the budget the clips of the
 * longest tracks are cut first and an "N more…" line says so. Asset names and title text are user
 * text: they are quoted and the API wraps the whole digest as data ("not instructions").
 */
import type { StudioClip, StudioProject, StudioTrack } from '@/lib/studioTypes';
import { clipEnd } from '@/lib/studio/previewEngine';
import { isLookEffectId } from '@/lib/studio/looks';
import { LUMETRI_PARAMS } from '@/lib/studio/effectRegistry';

import { trackLabel } from '@/lib/assistant/ops/applyStudio';

/** ~4k tokens at the API's conservative chars/3.5 estimate (the photo digest's budget). */
export const STUDIO_DIGEST_MAX_CHARS = 14_000;
const MAX_LINE = 500;

const r2 = (v: number) => Math.round(v * 100) / 100;
const q = (s: string, n = 60) => JSON.stringify(s.length > n ? `${s.slice(0, n - 1)}…` : s);

export interface StudioDigestAsset {
  name: string;
  kind: 'video' | 'audio' | 'image' | 'lut';
  durationSeconds?: number;
}

export interface StudioDigestInput {
  project: StudioProject;
  assets: Record<string, StudioDigestAsset | undefined>;
  playhead: number;
  selectedClipIds?: readonly string[];
}

function effectsText(c: StudioClip): string[] {
  const out: string[] = [];
  for (const e of c.effects ?? []) {
    if (e.type === 'lumetri') {
      const diff = LUMETRI_PARAMS.filter((p) => (e as unknown as Record<string, number>)[p.key] !== p.default).map((p) => `${p.key}=${r2((e as unknown as Record<string, number>)[p.key])}`);
      const name = isLookEffectId(e.id) ? `look:${e.id.slice(5)}` : `lumetri#${e.id}`;
      out.push(`${name}${e.enabled ? '' : '(off)'}${diff.length ? `(${diff.join(' ')})` : ''}`);
    } else if (e.type === 'lut') out.push(`lut#${e.id}(intensity=${r2(e.intensity)})`);
    else out.push(`chromakey#${e.id}(${e.keyColor})`);
  }
  return out;
}

function clipLine(c: StudioClip, assets: StudioDigestInput['assets']): string {
  const bits = [c.id, `${r2(c.timelineStart)}–${r2(clipEnd(c))}s`];
  if (c.title) {
    const texts = c.title.layers.flatMap((l) => (l.type === 'text' ? [q(l.text, 50)] : []));
    bits.push(`title ${texts.join(' / ') || '(shapes only)'}`);
  } else {
    const a = assets[c.assetId];
    bits.push(a ? `${a.kind} ${q(a.name, 50)}` : `asset ${c.assetId || '?'}`);
    bits.push(`src ${r2(c.sourceIn)}–${r2(c.sourceOut)}`);
  }
  if (c.freeze) bits.push('held frame');
  if (c.speed && c.speed !== 1) bits.push(`speed=${r2(c.speed)}`);
  if (c.reverse) bits.push('reversed');
  if (c.transition) bits.push(`transition=${c.transition.type} ${r2(c.transition.durationSeconds)}s`);
  const fx = effectsText(c);
  if (fx.length) bits.push(fx.join(' '));
  if (c.transform) bits.push(`transform x=${r2(c.transform.x)} y=${r2(c.transform.y)} scale=${r2(c.transform.scale)} rot=${r2(c.transform.rotationDeg)}`);
  if (c.opacity !== undefined && c.opacity !== 1) bits.push(`opacity=${r2(c.opacity)}`);
  if (c.volume !== undefined && c.volume !== 1) bits.push(`volume=${r2(c.volume)}`);
  const lanes = Object.entries(c.keyframes ?? {}).flatMap(([k, v]) =>
    k === 'effects' ? Object.entries((v as Record<string, unknown[]>) ?? {}).map(([p, l]) => `${p}:${l.length}`) : Array.isArray(v) && v.length ? [`${k}:${v.length}`] : [],
  );
  if (lanes.length) bits.push(`keyframes ${lanes.join(' ')}`);
  if (c.groupId) bits.push('grouped');
  const line = bits.join(' · ');
  return line.length > MAX_LINE ? `${line.slice(0, MAX_LINE - 1)}…` : line;
}

function trackHead(t: StudioTrack): string {
  const flags = [t.muted ? 'muted' : '', t.locked ? 'LOCKED' : '', t.hidden ? 'hidden' : '', t.solo ? 'solo' : '', t.gain !== undefined && t.gain !== 1 ? `gain=${r2(t.gain)}` : '', t.effects ? 'eq/comp' : '']
    .filter(Boolean)
    .join(' ');
  return `track ${trackLabel(t)} (${t.kind}${t.name ? ` ${q(t.name, 40)}` : ''})${flags ? ` ${flags}` : ''} · ${t.clips.length} clip${t.clips.length === 1 ? '' : 's'}:`;
}

export function studioDigest({ project: p, assets, playhead, selectedClipIds = [] }: StudioDigestInput): string {
  const end = p.tracks.reduce((m, t) => t.clips.reduce((mm, c) => Math.max(mm, clipEnd(c)), m), 0);
  const head: string[] = ['Darkroom timeline (times in seconds; video tracks stack upward: V2 draws over V1; keyframe t is seconds from the clip start).'];
  head.push(`canvas ${p.width}x${p.height} @ ${p.fps} fps · duration ${r2(end)}s · playhead ${r2(playhead)}s`);
  const a = p.audio;
  if (a?.duckingEnabled) {
    const voice = p.tracks.find((t) => t.id === a.duckVoiceTrackId);
    head.push(`ducking on: voice ${voice ? trackLabel(voice) : '?'} · ${a.duckAmountDb} dB · attack ${a.duckAttackMs} ms · release ${a.duckReleaseMs} ms`);
  }
  head.push(`captions: ${p.captions.length ? `${p.captions.length} cues ${p.captionsEnabled ? 'on' : 'off'}` : 'none'}`);
  const markers = [...(p.markers ?? [])].sort((x, y) => x.t - y.t);
  if (markers.length) head.push(`markers: ${markers.slice(0, 20).map((m) => `${r2(m.t)}s ${q(m.name, 30)}`).join(', ')}${markers.length > 20 ? ` (+${markers.length - 20})` : ''}`);
  head.push(`selected: ${selectedClipIds.length ? selectedClipIds.slice(0, 10).join(', ') : 'none'}`);

  // Video top-down (as the timeline shows it), then audio A1, A2…
  const ordered = [...p.tracks].sort((x, y) => (x.kind !== y.kind ? (x.kind === 'video' ? -1 : 1) : x.kind === 'video' ? y.index - x.index : x.index - y.index));
  const blocks = ordered.map((t) => ({ head: trackHead(t), lines: [...t.clips].sort((x, y) => x.timelineStart - y.timelineStart).map((c) => `  ${clipLine(c, assets)}`) }));
  const size = () => head.join('\n').length + blocks.reduce((n, b) => n + b.head.length + 1 + b.lines.reduce((m, l) => m + l.length + 1, 0), 0);
  let dropped = 0;
  // Longest track first: trim its last clips until the digest fits.
  while (size() > STUDIO_DIGEST_MAX_CHARS - 40) {
    const longest = blocks.reduce((x, y) => (y.lines.length > x.lines.length ? y : x));
    if (longest.lines.length === 0) break;
    longest.lines.pop();
    dropped += 1;
  }
  const body = blocks.flatMap((b) => [b.head, ...(b.lines.length ? b.lines : ['  (empty)'])]);
  return [...head, ...body, ...(dropped ? [`… ${dropped} more clips not shown`] : [])].join('\n');
}
