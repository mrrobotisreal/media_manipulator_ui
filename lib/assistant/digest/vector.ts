/**
 * MM110: the Motion document digest Medi reads (design MEDI_ASSISTANT.md §9.1, ticket decision 4).
 *
 * Compact text the model can reference by id: canvas, duration, fps and loop, the layer tree
 * (`id · type · name · bbox in canvas units · fill/stroke · flags`), the animation tracks
 * (`layerId.property: n keys t0–t1 ms`), the selection and the playhead. Deterministic and
 * bounded (~4k tokens): over budget, the longest layer lines go first and an "N more…" line says
 * so. Layer names and text are user content: quoted (JSON), and the API wraps the whole digest
 * as data ("not instructions").
 */
import { layerDocBounds } from '@/lib/vector/transformOps';
import { docLoops, type Layer, type VectorDoc } from '@/lib/vector/vectorTypes';

/** ~4k tokens at the API's conservative chars/3.5 estimate. */
export const VECTOR_DIGEST_MAX_CHARS = 14_000;
const MAX_LINE = 400;

const r = (n: number) => Math.round(n);
const q = (s: string, max = 60) => JSON.stringify(s.length > max ? `${s.slice(0, max)}…` : s);

export interface VectorDigestInput {
  doc: VectorDoc;
  selection: string[];
  /** Playhead, ms. */
  time: number;
}

function layerLine(doc: VectorDoc, l: Layer, depth: number): string {
  const bits = [`${'  '.repeat(depth)}${l.id}`, l.type];
  if (l.name) bits.push(`name=${q(l.name)}`);
  if (l.type === 'raw') return `${bits.join(' · ')} · kept as imported (not editable)`.slice(0, MAX_LINE);
  if (l.type === 'text') bits.push(`text=${q(l.text, 80)}`, `size=${l.fontSize ?? 16}`);
  const b = layerDocBounds(doc, l.id);
  if (b) bits.push(`bbox=${r(b.x)},${r(b.y)} ${r(b.width)}x${r(b.height)}`);
  if (l.fill && l.type !== 'group') bits.push(`fill=${l.fill.slice(0, 40)}`);
  if (l.stroke && l.stroke !== 'none') bits.push(`stroke=${l.stroke.slice(0, 40)}${l.strokeWidth !== undefined ? `/${l.strokeWidth}` : ''}`);
  if (l.opacity !== undefined && l.opacity !== 1) bits.push(`opacity=${l.opacity}`);
  if (l.mask) bits.push('masked');
  if (l.clipPath) bits.push('clipped');
  if (l.hidden) bits.push('hidden');
  if (l.locked) bits.push('locked');
  return bits.join(' · ').slice(0, MAX_LINE);
}

function walk(doc: VectorDoc, layers: Layer[], depth: number, out: string[]): void {
  // Top of the stack first (the layer panel's order).
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    const l = layers[i];
    out.push(layerLine(doc, l, depth));
    if (l.type === 'group') walk(doc, l.children, depth + 1, out);
  }
}

export function vectorDigest({ doc, selection, time }: VectorDigestInput): string {
  const vb = doc.canvas.viewBox;
  const head: string[] = [
    'Motion animation (layers listed top of the stack first; children indented; coordinates are canvas user units, y down).',
    `canvas ${r(vb.width)}x${r(vb.height)} (viewBox ${r(vb.x)} ${r(vb.y)} ${r(vb.width)} ${r(vb.height)}), background ${doc.canvas.background}`,
    `duration ${doc.duration} ms, ${doc.fps} fps, ${docLoops(doc) ? 'loops' : 'plays once'}; playhead ${Math.round(time)} ms`,
    `selected: ${selection.length ? selection.join(', ') : 'none'}`,
  ];
  const layerLines: string[] = [];
  walk(doc, doc.layers, 0, layerLines);
  if (layerLines.length === 0) layerLines.push('(no layers: the canvas is empty)');
  const trackLines = [...doc.animations]
    .sort((a, b) => (a.layerId === b.layerId ? a.property.localeCompare(b.property) : a.layerId.localeCompare(b.layerId)))
    .map((tr) => {
      const ks = tr.keyframes;
      return `${tr.layerId}.${tr.property}: ${ks.length} key${ks.length === 1 ? '' : 's'} ${ks.length ? `${ks[0].t}–${ks[ks.length - 1].t} ms` : ''}`.trim();
    });
  const tracks = trackLines.length ? [`tracks (${trackLines.length}):`, ...trackLines] : ['tracks: none (nothing is animated yet)'];
  const masks = doc.defs.masks.length || doc.defs.clipPaths.length ? [`masks ${doc.defs.masks.length}, clip paths ${doc.defs.clipPaths.length}, gradients ${doc.defs.gradients.length}`] : [];
  const fixed = [...head, `layers (${layerLines.length}):`];
  const tail = [...tracks, ...masks];
  const budget = VECTOR_DIGEST_MAX_CHARS - [...fixed, ...tail].join('\n').length - 40;
  let used = layerLines.reduce((a, l) => a + l.length + 1, 0);
  if (used <= budget) return [...fixed, ...layerLines, ...tail].join('\n');
  const order = layerLines.map((l, i) => ({ l, i })).sort((a, b) => b.l.length - a.l.length || a.i - b.i);
  const dropped = new Set<number>();
  for (const { l, i } of order) {
    if (used <= budget) break;
    dropped.add(i);
    used -= l.length + 1;
  }
  const kept = layerLines.filter((_, i) => !dropped.has(i));
  const out = [...fixed, ...kept, `… ${dropped.size} more layers not shown`, ...tail].join('\n');
  // Tracks alone may still exceed the budget on a huge document: cut the end.
  return out.length > VECTOR_DIGEST_MAX_CHARS ? `${out.slice(0, VECTOR_DIGEST_MAX_CHARS - 30)}\n… (digest truncated)` : out;
}
