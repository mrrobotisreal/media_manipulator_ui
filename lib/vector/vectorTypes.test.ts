import { describe, expect, it } from 'vitest';
import {
  DEFAULT_BACKGROUND,
  DEFAULT_CANVAS_SIZE,
  DEFAULT_DURATION_MS,
  DEFAULT_FPS,
  parseVectorDoc,
  serializeVectorDoc,
  type VectorDoc,
} from './vectorTypes';
import { docFixtures, inputFixtures, invalidFixtures, readFixture } from './fixtures/fixtures';

const mustParse = (input: unknown): VectorDoc => {
  const r = parseVectorDoc(input);
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};

describe('VectorDoc v1 schema', () => {
  it.each(docFixtures())('%s parses and re-serialises byte-identically', (file) => {
    const text = readFixture(file);
    const doc = mustParse(text);
    expect(serializeVectorDoc(doc)).toBe(text);
  });

  it.each(inputFixtures())('input %s parses', (file) => {
    expect(parseVectorDoc(readFixture('inputs', file)).ok).toBe(true);
  });

  it.each(invalidFixtures())('invalid/%s is rejected', (file) => {
    const r = parseVectorDoc(readFixture('invalid', file));
    expect(r.ok).toBe(false);
  });

  it('fills the proposed defaults: 512×512, transparent, 3000 ms, 24 fps', () => {
    const doc = mustParse({ version: 1 });
    expect(doc.canvas).toEqual({
      width: DEFAULT_CANVAS_SIZE,
      height: DEFAULT_CANVAS_SIZE,
      viewBox: { x: 0, y: 0, width: 512, height: 512 },
      background: DEFAULT_BACKGROUND,
    });
    expect(DEFAULT_CANVAS_SIZE).toBe(512);
    expect(DEFAULT_BACKGROUND).toBe('transparent');
    expect(doc.duration).toBe(DEFAULT_DURATION_MS);
    expect(DEFAULT_DURATION_MS).toBe(3000);
    expect(doc.fps).toBe(DEFAULT_FPS);
    expect(DEFAULT_FPS).toBe(24);
    expect(doc.layers).toEqual([]);
    expect(doc.animations).toEqual([]);
    expect(doc.defs).toEqual({ gradients: [], masks: [], clipPaths: [], filters: [], symbols: [] });
  });

  it('derives the viewBox from width/height when absent', () => {
    expect(mustParse({ version: 1, canvas: { width: 100, height: 50 } }).canvas.viewBox).toEqual({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    });
  });

  it('rejects version 2 and a missing version', () => {
    expect(parseVectorDoc({ version: 2 }).ok).toBe(false);
    expect(parseVectorDoc({}).ok).toBe(false);
    expect(parseVectorDoc({ version: '1' }).ok).toBe(false);
  });

  it('keeps unknown optional fields through parse → serialize (additive rule)', () => {
    const doc = mustParse(readFixture('additive.json'));
    const again = JSON.parse(serializeVectorDoc(doc));
    expect(again.futureMeta).toEqual({ author: 'a newer build' });
    expect(again.canvas.futureGrid).toEqual({ size: 8 });
    expect(again.defs.futurePatterns).toEqual([]);
    expect(again.layers[0].children[0].futureBlendMode).toBe('multiply');
  });

  it('preserves animations verbatim', () => {
    const text = readFixture('animated.json');
    const doc = mustParse(text);
    expect(doc.animations).toHaveLength(5);
    expect(JSON.parse(serializeVectorDoc(doc)).animations).toEqual(JSON.parse(text).animations);
  });

  it('rejects invalid JSON and oversize text without throwing', () => {
    expect(parseVectorDoc('{').ok).toBe(false);
    expect(parseVectorDoc(' '.repeat(4 * 1024 * 1024 + 1)).ok).toBe(false);
  });

  it('accepts references into raw-layer ids', () => {
    const doc = {
      version: 1,
      layers: [
        { type: 'raw', id: 'raw-1', markup: '<pattern id="dots"/>', ids: ['dots'] },
        { type: 'rect', id: 'r', x: 0, y: 0, width: 1, height: 1, fill: 'url(#dots)' },
      ],
    };
    expect(parseVectorDoc(doc).ok).toBe(true);
  });

  it('allows a paint fallback after the url', () => {
    const doc = {
      version: 1,
      defs: { gradients: [{ type: 'linear', id: 'g', x1: 0, y1: 0, x2: 1, y2: 0, stops: [] }] },
      layers: [{ type: 'rect', id: 'r', x: 0, y: 0, width: 1, height: 1, fill: 'url(#g) red' }],
    };
    expect(parseVectorDoc(doc).ok).toBe(true);
  });
});
