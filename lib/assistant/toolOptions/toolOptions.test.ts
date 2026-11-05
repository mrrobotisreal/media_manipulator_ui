import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { PRIMARY_TOOL_PAGES } from '@/content/toolPages';
import { audioConversionSchema } from '@/schemas/audioSchema';
import { imageConversionSchema } from '@/schemas/imageSchema';
import { pdfConversionSchema } from '@/schemas/pdfSchema';
import { videoConversionSchema } from '@/schemas/videoSchema';

import {
  MAX_OPTIONS_JSON_CHARS,
  MAX_OPTIONS_PARAM_CHARS,
  decodeOptions,
  encodeOptions,
  toBase64Url,
} from './codec';
import { optionsFileText, optionsJsonSchema } from './export';
import { audioFormDefaults, imageFormDefaults, mergeDefaults, pdfFormDefaults, trimOf, videoFormDefaults } from './prefill';
import { allToolOptionSpecs, optionsSpecForTool, specInputOf } from './registry';
import { readDeepLinkOptions } from './useDeepLink';
import { TOOL_SIDECAR_DIR, loadToolSidecar, parseSidecar } from './sidecars';

const tool = (slug: string) => PRIMARY_TOOL_PAGES.find((t) => t.slug === slug)!;

describe('option-schema coverage (MM116a decision 1)', () => {
  const all = allToolOptionSpecs();

  it('every primary tool has options or an explicit none with a reason', () => {
    expect(all.length).toBe(PRIMARY_TOOL_PAGES.length);
    for (const { tool: t, spec } of all) {
      if (spec.kind === 'none') expect(spec.reason.length, t.slug).toBeGreaterThan(10);
      else expect(Object.keys(spec.schema.shape).length, t.slug).toBeGreaterThan(0);
    }
  });

  it('editors and multi-step flows are explicitly none', () => {
    for (const slug of ['content-studio', 'motion', 'aperture', 'ai-video-restoration', 'ai-image-restoration', 'ai-document-scan', 'voice-cloning', 'inspect-metadata']) {
      expect(optionsSpecForTool(tool(slug)).kind, slug).toBe('none');
    }
  });

  it('emits strict JSON Schema with a UI label on every property', () => {
    for (const { tool: t, spec } of all) {
      const js = optionsJsonSchema(spec);
      if (!js) continue;
      expect(js.additionalProperties, t.slug).toBe(false);
      for (const [k, v] of Object.entries(js.properties as Record<string, Record<string, unknown>>)) {
        expect(v['x-uiLabel'], `${t.slug}.${k}`).toBeTruthy();
      }
    }
  });

  it('a locked output format is not a free option', () => {
    const webp = optionsSpecForTool(tool('convert-png-to-jpg'));
    expect(webp.kind === 'options' && 'format' in webp.schema.shape).toBe(false);
  });

  it('compress-video exposes the real compressor ranges', () => {
    const js = optionsJsonSchema(optionsSpecForTool(tool('compress-video')))!;
    const props = js.properties as Record<string, Record<string, unknown>>;
    expect(props.crf).toMatchObject({ type: 'integer', minimum: 18, maximum: 40 });
    expect(props.level.enum).toEqual(['smallest', 'balanced', 'high_quality']);
  });
});

describe('sidecars (decision 1)', () => {
  it('every primary tool has a well-formed sidecar whose related slugs exist', () => {
    const slugs = new Set(PRIMARY_TOOL_PAGES.map((t) => t.slug));
    for (const t of PRIMARY_TOOL_PAGES) {
      const s = loadToolSidecar(t.slug, join(__dirname, '../../..'));
      expect(s, `${TOOL_SIDECAR_DIR}/${t.slug}.md`).not.toBeNull();
      expect(s!.related.length, t.slug).toBeGreaterThanOrEqual(1);
      for (const r of s!.related) {
        expect(slugs.has(r.slug), `${t.slug} -> ${r.slug}`).toBe(true);
        expect(r.slug).not.toBe(t.slug);
      }
      expect(s!.whenToUse + s!.whenNotToUse).not.toMatch(/[$€£]\s?\d/);
    }
  });

  it('parses the three sections', () => {
    const s = parseSidecar('## When to use\nA.\n\n## When not to use\nB.\n\n## Related\n- x-y: because\n');
    expect(s).toEqual({ whenToUse: 'A.', whenNotToUse: 'B.', related: [{ slug: 'x-y', reason: 'because' }] });
    expect(parseSidecar('## When to use\nA.')).toBeNull();
  });
});

describe('deep link codec (decision 2): valid, invalid, oversized', () => {
  const spec = optionsSpecForTool(tool('compress-video'));

  it('valid: round-trips and validates', () => {
    const o = encodeOptions({ level: 'smallest', crf: 30, resolution: '720' });
    expect(decodeOptions(o, spec)).toEqual({ ok: true, options: { level: 'smallest', crf: 30, resolution: '720' } });
  });

  it('invalid: out of range, unknown key, wrong type, not an object, bad base64, not JSON', () => {
    const bad = (v: unknown) => decodeOptions(toBase64Url(JSON.stringify(v)), spec);
    expect(bad({ crf: 99 })).toMatchObject({ ok: false, reason: 'invalid' });
    expect(bad({ crf: 17 })).toMatchObject({ ok: false, reason: 'invalid' });
    expect(bad({ bitrate: 5 })).toMatchObject({ ok: false, reason: 'invalid' });
    expect(bad({ level: 'ultra' })).toMatchObject({ ok: false, reason: 'invalid' });
    expect(bad({ stripAudio: 'yes' })).toMatchObject({ ok: false, reason: 'invalid' });
    expect(bad([1, 2])).toMatchObject({ ok: false, reason: 'not_object' });
    expect(decodeOptions('not base64 !!', spec)).toMatchObject({ ok: false, reason: 'not_base64url' });
    expect(decodeOptions(toBase64Url('{oops'), spec)).toMatchObject({ ok: false, reason: 'not_json' });
    expect(decodeOptions('', spec)).toMatchObject({ ok: false, reason: 'empty' });
    expect(decodeOptions(null, spec)).toMatchObject({ ok: false, reason: 'empty' });
  });

  it('a tool with no options refuses every link', () => {
    expect(decodeOptions(encodeOptions({ a: 1 }), optionsSpecForTool(tool('motion')))).toMatchObject({ ok: false, reason: 'no_options' });
  });

  it('oversized: the param and the JSON are both capped', () => {
    const huge = toBase64Url(JSON.stringify({ level: 'smallest', pad: 'x'.repeat(MAX_OPTIONS_JSON_CHARS) }));
    expect(huge.length).toBeGreaterThan(MAX_OPTIONS_PARAM_CHARS);
    expect(decodeOptions(huge, spec)).toMatchObject({ ok: false, reason: 'oversized' });
    // Under both caps the size check passes and the unknown key is what fails.
    const under = toBase64Url(JSON.stringify({ level: 'smallest', pad: 'x'.repeat(1200) }));
    expect(under.length).toBeLessThanOrEqual(MAX_OPTIONS_PARAM_CHARS);
    expect(decodeOptions(under, spec)).toMatchObject({ ok: false, reason: 'invalid' });
  });

  it('is utf-8 safe', () => {
    const t = optionsSpecForTool(tool('add-text-to-image'));
    const o = encodeOptions({ overlayText: 'Привет, мир 你好 🎬' });
    expect(decodeOptions(o, t)).toEqual({ ok: true, options: { overlayText: 'Привет, мир 你好 🎬' } });
  });
});

/** The ends of a numeric range, a representative of each enum: what an accepted link can hold. */
describe('prefill reaches the form: the form resolver accepts what the schema accepts', () => {
  const bounds = (slug: string) => {
    const js = optionsJsonSchema(optionsSpecForTool(tool(slug)))!;
    const props = js.properties as Record<string, { minimum?: number; maximum?: number; enum?: unknown[]; type?: string }>;
    const lo: Record<string, unknown> = {};
    const hi: Record<string, unknown> = {};
    for (const [k, p] of Object.entries(props)) {
      if (typeof p.minimum === 'number' && typeof p.maximum === 'number') {
        lo[k] = p.minimum;
        hi[k] = p.maximum;
      } else if (p.enum) {
        lo[k] = p.enum[0];
        hi[k] = p.enum[p.enum.length - 1];
      }
    }
    return [lo, hi];
  };

  it.each([
    ['image-converter', imageFormDefaults, imageConversionSchema, { format: 'jpg', quality: 85, filter: 'none', metadataMode: 'keep' }],
    ['add-text-to-image', imageFormDefaults, imageConversionSchema, { format: 'jpg', quality: 85, filter: 'none', metadataMode: 'keep' }],
    ['ai-image-upscaler', imageFormDefaults, imageConversionSchema, { format: 'jpg', quality: 85, filter: 'none', metadataMode: 'keep', ai: { operation: 'ai_upscale' } }],
    ['video-converter', videoFormDefaults, videoConversionSchema, { format: 'mp4', quality: 'medium', speed: 1, preserveAspectRatio: true }],
    ['change-video-speed', videoFormDefaults, videoConversionSchema, { format: 'mp4', quality: 'medium', speed: 1, preserveAspectRatio: true }],
    ['convert-video-to-animated-gif', videoFormDefaults, videoConversionSchema, { format: 'gif', quality: 'medium', speed: 1, preserveAspectRatio: true }],
    ['audio-converter', audioFormDefaults, audioConversionSchema, { format: 'mp3' }],
    ['change-audio-pitch', audioFormDefaults, audioConversionSchema, { format: 'mp3' }],
    ['pdf-to-jpg', pdfFormDefaults, pdfConversionSchema, { format: 'jpg', quality: 90, dpi: 150, pageSelection: 'all' }],
  ] as const)('%s: both ends of every range', (slug, map, schema, base) => {
    for (const o of bounds(slug)) {
      const decoded = decodeOptions(encodeOptions(o), optionsSpecForTool(tool(slug)));
      expect(decoded.ok, `${slug} ${JSON.stringify(o)}`).toBe(true);
      if (!decoded.ok) continue;
      const state = mergeDefaults(base as Record<string, unknown>, map(decoded.options));
      const res = schema.safeParse(state);
      expect(res.success, `${slug} ${JSON.stringify(o)} ${res.success ? '' : JSON.stringify(res.error.issues.slice(0, 3))}`).toBe(true);
    }
  });

  it('maps friendly names onto the form shape', () => {
    expect(videoFormDefaults({ targetFps: 30, stabilize: true, gifFps: 15, aiTargetFps: 48 })).toMatchObject({
      temporal: { frameRate: { target: 30 }, stabilization: { enabled: true } },
      gif: { fps: 15 },
      ai: { frameInterpolation: { targetFps: 48 } },
    });
    expect(audioFormDefaults({ pitchSemitones: 3, equalizerPreset: 'vocal', reverbType: 'hall' })).toMatchObject({
      advanced: { pitchShift: { enabled: true, semitones: 3 } },
      basicProcessing: { equalizer: { enabled: true, preset: 'vocal' } },
      timeBasedEffects: { reverb: { enabled: true, type: 'hall' } },
    });
    expect(trimOf({ trimStart: 5, trimEnd: 12 })).toEqual({ startTime: 5, endTime: 12 });
    expect(trimOf({ trimStart: 12, trimEnd: 5 })).toBeUndefined();
  });

  it('mergeDefaults never lets undefined overwrite and merges nested objects', () => {
    expect(mergeDefaults({ a: 1, n: { x: 1, y: 2 } }, { a: undefined, n: { y: 9 } })).toEqual({ a: 1, n: { x: 1, y: 9 } });
  });
});

describe('options.json files', () => {
  it('none and options shapes', () => {
    expect(JSON.parse(optionsFileText('motion', optionsSpecForTool(tool('motion'))))).toMatchObject({ slug: 'motion', options: 'none' });
    expect(JSON.parse(optionsFileText('compress-video', optionsSpecForTool(tool('compress-video'))))).toMatchObject({ slug: 'compress-video', options: { type: 'object' } });
  });
  it('the sidecar dir exists on disk', () => {
    expect(readFileSync(join(__dirname, '../../..', TOOL_SIDECAR_DIR, 'compress-video.md'), 'utf8')).toContain('## When to use');
  });
});

describe('page-side read of ?o= (readDeepLinkOptions)', () => {
  const input = specInputOf(tool('compress-video'));
  it('valid link prefills; invalid, oversized, missing and tool-without-options are ignored', () => {
    const ok = encodeOptions({ level: 'smallest', resolution: '480' });
    expect(readDeepLinkOptions(`?preset=x&o=${ok}`, input)).toEqual({ level: 'smallest', resolution: '480' });
    expect(readDeepLinkOptions(`?o=${encodeOptions({ crf: 99 })}`, input)).toBeUndefined();
    expect(readDeepLinkOptions(`?o=${toBase64Url(JSON.stringify({ level: 'smallest', pad: 'x'.repeat(4000) }))}`, input)).toBeUndefined();
    expect(readDeepLinkOptions('?o=%%%', input)).toBeUndefined();
    expect(readDeepLinkOptions('', input)).toBeUndefined();
    expect(readDeepLinkOptions(`?o=${ok}`, specInputOf(tool('motion')))).toBeUndefined();
  });
});
