/**
 * MM108: the Aperture document digest Medi reads (design MEDI_ASSISTANT.md §9.1).
 *
 * Compact text the model can reference by id: source size, geometry, every layer as
 * `id · type · params that differ from the default · mask summary · opacity/blend`, the
 * histogram stats (mean luma, clipping) and the selected layer. Deterministic for the same input
 * (no dates, no ids invented) and bounded (~4k tokens): when it would exceed the budget the
 * longest layer lines are cut and an "N more…" line says so. Layer names are user text: they are
 * quoted and the API wraps the whole digest as data ("not instructions").
 */
import { isMaskRef, LAYER_PARAMS, type AdjustmentLayer, type Mask, type PhotoDoc } from '@/lib/photo/photoTypes';
import type { Histogram } from '@/lib/photo/gl/histogram';

/** ~4k tokens at the API's conservative chars/3.5 estimate. */
export const PHOTO_DIGEST_MAX_CHARS = 14_000;
const MAX_LINE = 600;

const round = (v: number) => Math.round(v * 1000) / 1000;

/** The leaf values of `params` that differ from the type's defaults, as `path=value`. */
export function paramDiff(type: AdjustmentLayer['type'], params: unknown): string[] {
  const def = (LAYER_PARAMS[type] as unknown as { parse(v: unknown): unknown }).parse({});
  const out: string[] = [];
  const walk = (a: unknown, b: unknown, path: string) => {
    if (Array.isArray(a)) {
      if (JSON.stringify(a) !== JSON.stringify(b)) {
        if (type === 'hsl' && path === 'ranges') {
          for (const r of a as Array<Record<string, unknown>>) {
            const parts = (['hue', 'saturation', 'lightness'] as const).filter((k) => r[k] !== 0).map((k) => `${k}=${round(r[k] as number)}`);
            const shape = String(r.id).startsWith('custom-') ? ` center=${r.center} width=${r.width}` : '';
            if (parts.length || shape) out.push(`ranges.${r.id}(${[...parts, shape.trim()].filter(Boolean).join(' ')})`);
          }
        } else if (path.endsWith('points')) {
          out.push(`${path}=${(a as Array<{ x: number; y: number }>).map((p) => `${round(p.x)}:${round(p.y)}`).join(',')}`);
        } else out.push(`${path}=${JSON.stringify(a).slice(0, 120)}`);
      }
      return;
    }
    if (a && typeof a === 'object') {
      for (const k of Object.keys(a).sort()) walk((a as Record<string, unknown>)[k], (b as Record<string, unknown> | null)?.[k], path ? `${path}.${k}` : k);
      return;
    }
    if (path === 'cube') {
      if (a) out.push('cube=<loaded>');
      return;
    }
    if (a !== b) out.push(`${path}=${typeof a === 'number' ? round(a) : JSON.stringify(a)}`);
  };
  walk(params, def, '');
  return out;
}

function maskSummary(doc: PhotoDoc, m: Mask | { ref: string } | null): string {
  if (!m) return '';
  const ref = isMaskRef(m) ? m.ref : null;
  const mask = ref ? doc.masks?.[ref] : (m as Mask);
  if (!mask) return ref ? `mask=shared:${ref}(missing)` : '';
  const parts = mask.components.map((c) => {
    switch (c.kind) {
      case 'gradient':
        return `gradient(${round(c.from.x)},${round(c.from.y)}→${round(c.to.x)},${round(c.to.y)})`;
      case 'radial':
        return `radial(c=${round(c.center.x)},${round(c.center.y)} r=${round(c.rx)}x${round(c.ry)})`;
      case 'luminosity':
        return `luminosity(${round(c.lo)}-${round(c.hi)})`;
      case 'colorRange':
        return `colorRange(${c.colors.length} colours)`;
      case 'brush':
        return 'brush(painted)';
      case 'subject':
        return c.invert ? 'subject(background)' : 'subject';
    }
  });
  const extra = [mask.invert ? 'inverted' : '', mask.feather ? `feather=${mask.feather}` : ''].filter(Boolean).join(' ');
  return `mask=${ref ? `shared:${ref} ` : ''}${parts.join('+') || 'empty'}${extra ? ` ${extra}` : ''}`;
}

function layerLine(doc: PhotoDoc, l: AdjustmentLayer, index: number): string {
  const bits = [`${index}`, l.id, l.type];
  if (l.name) bits.push(`name=${JSON.stringify(l.name.slice(0, 60))}`);
  if (l.group) bits.push(`group=${JSON.stringify(l.group.slice(0, 60))}`);
  if (!l.enabled) bits.push('hidden');
  if (l.opacity !== 1) bits.push(`opacity=${round(l.opacity)}`);
  if (l.blend !== 'normal') bits.push(`blend=${l.blend}`);
  const diff = paramDiff(l.type, l.params);
  bits.push(diff.length ? diff.join(' ') : 'defaults');
  const m = maskSummary(doc, l.mask);
  if (m) bits.push(m);
  const line = bits.join(' · ');
  return line.length > MAX_LINE ? `${line.slice(0, MAX_LINE - 1)}…` : line;
}

export interface PhotoDigestInput {
  doc: PhotoDoc;
  selection?: string | null;
  histogram?: Pick<Histogram, 'luma'> | null;
  /** Size of the image the preview shows (heal bases may differ from `doc.source`). */
  previewSize?: { width: number; height: number } | null;
}

/** Mean luma (0..1) and the share of clipped pixels at each end. */
export function histogramStats(h: Pick<Histogram, 'luma'>): { mean: number; shadowsClipped: number; highlightsClipped: number } {
  let n = 0;
  let s = 0;
  for (let i = 0; i < 256; i += 1) {
    n += h.luma[i];
    s += h.luma[i] * i;
  }
  if (n === 0) return { mean: 0, shadowsClipped: 0, highlightsClipped: 0 };
  const lo = h.luma[0] + h.luma[1];
  const hi = h.luma[254] + h.luma[255];
  return { mean: round(s / n / 255), shadowsClipped: round(lo / n), highlightsClipped: round(hi / n) };
}

export function photoDigest({ doc, selection, histogram, previewSize }: PhotoDigestInput): string {
  const head: string[] = ['Aperture photo (layers apply bottom to top; index 0 is the bottom).'];
  head.push(`source ${doc.source.width}x${doc.source.height}${previewSize && (previewSize.width !== doc.source.width || previewSize.height !== doc.source.height) ? ` (preview ${previewSize.width}x${previewSize.height})` : ''}`);
  const g = doc.geometry;
  const geo = [
    g.rotate ? `rotate=${round(g.rotate)}` : '',
    g.flipH ? 'flipH' : '',
    g.flipV ? 'flipV' : '',
    g.crop ? `crop=${round(g.crop.x)},${round(g.crop.y)} ${round(g.crop.width)}x${round(g.crop.height)}` : '',
    g.perspective ? 'perspective' : '',
  ].filter(Boolean);
  head.push(`geometry: ${geo.length ? geo.join(' ') : 'none'}`);
  if (doc.heals.length) head.push(`heals: ${doc.heals.length}`);
  if (histogram) {
    const st = histogramStats(histogram);
    head.push(`histogram: mean luma ${st.mean}, shadows clipped ${Math.round(st.shadowsClipped * 1000) / 10}%, highlights clipped ${Math.round(st.highlightsClipped * 1000) / 10}%`);
  }
  head.push(`selected layer: ${selection && doc.layers.some((l) => l.id === selection) ? selection : 'none'}`);
  head.push(`layers (${doc.layers.length}):`);
  const lines = doc.layers.map((l, i) => layerLine(doc, l, i));
  if (lines.length === 0) lines.push('(none: the photo is unedited)');
  const budget = PHOTO_DIGEST_MAX_CHARS - head.join('\n').length - 40;
  let used = lines.reduce((a, l) => a + l.length + 1, 0);
  if (used <= budget) return [...head, ...lines].join('\n');
  // Longest first: drop the longest lines until it fits, keeping stack order for the rest.
  const order = lines.map((l, i) => ({ l, i })).sort((a, b) => b.l.length - a.l.length || a.i - b.i);
  const dropped = new Set<number>();
  for (const { l, i } of order) {
    if (used <= budget) break;
    dropped.add(i);
    used -= l.length + 1;
  }
  const kept = lines.filter((_, i) => !dropped.has(i));
  return [...head, ...kept, `… ${dropped.size} more layers not shown`].join('\n');
}
