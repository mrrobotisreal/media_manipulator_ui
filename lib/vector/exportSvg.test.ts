import { describe, expect, it } from 'vitest';

import { serializeSvg, svgFileName } from './exportSvg';
import { parseSvg } from './importSvg';
import { parseVectorDoc, serializeVectorDoc, type VectorDoc } from './vectorTypes';
import { docFixtures, readFixture, svgFixtures } from './fixtures/fixtures';

const doc = (input: unknown): VectorDoc => {
  const r = parseVectorDoc(input);
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};

describe('golden idempotence', () => {
  it.each(svgFixtures())('SVG → doc → SVG → doc → SVG is a fixed point (%s)', (file) => {
    const doc1 = parseSvg(readFixture(file)).doc;
    const svg1 = serializeSvg(doc1);
    const doc2 = parseSvg(svg1).doc;
    const svg2 = serializeSvg(doc2);
    const doc3 = parseSvg(svg2).doc;
    expect(svg2).toBe(svg1);
    expect(serializeVectorDoc(doc2)).toBe(serializeVectorDoc(doc1));
    expect(serializeVectorDoc(doc3)).toBe(serializeVectorDoc(doc2));
  });

  it.each(docFixtures())('doc → SVG → doc is stable for %s', (file) => {
    const d = doc(readFixture(file));
    const svg1 = serializeSvg(d);
    expect(serializeSvg(parseSvg(svg1).doc)).toBe(svg1);
  });

  it('never emits scripts or handlers on the golden set', () => {
    for (const file of svgFixtures()) {
      const out = serializeSvg(parseSvg(readFixture(file)).doc);
      expect(out, file).not.toMatch(/<script/i);
      expect(out, file).not.toMatch(/\son[a-z]+\s*=/i);
      expect(out, file).not.toMatch(/javascript:/i);
    }
  });

  it('keeps an unsupported element byte-identical as a raw layer', () => {
    const source = '<switch><rect x="150" y="150" width="40" height="40" fill="green"/></switch>';
    expect(readFixture('unsupported.svg')).toContain(source);
    const d1 = parseSvg(readFixture('unsupported.svg')).doc;
    const raw = d1.layers.find((l) => l.type === 'raw' && l.markup.startsWith('<switch'));
    expect(raw && raw.type === 'raw' && raw.markup).toBe(source);
    const svg1 = serializeSvg(d1);
    expect(svg1).toContain(source);
    const again = parseSvg(svg1).doc.layers.find((l) => l.type === 'raw' && l.markup.startsWith('<switch'));
    expect(again && again.type === 'raw' && again.markup).toBe(source);
  });
});

describe('serializeSvg', () => {
  it('writes the canonical blank document', () => {
    expect(serializeSvg(doc({ version: 1 }))).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"/>\n',
    );
  });

  it('writes a background rect for an opaque canvas and reads it back', () => {
    const d = doc({ version: 1, canvas: { width: 10, height: 10, background: '#000' } });
    const out = serializeSvg(d);
    expect(out).toContain('<rect data-vector-background="" x="0" y="0" width="10" height="10" fill="#000"/>');
    const back = parseSvg(out).doc;
    expect(back.canvas.background).toBe('#000');
    expect(back.layers).toEqual([]);
  });

  it('escapes text and attribute values', () => {
    const d = doc({
      version: 1,
      layers: [{ type: 'text', id: 't', name: 'a"b<c', x: 0, y: 0, text: '<b>&</b>' }],
    });
    const out = serializeSvg(d);
    expect(out).toContain('data-name="a&quot;b&lt;c"');
    expect(out).toContain('>&lt;b&gt;&amp;&lt;/b&gt;</text>');
  });

  it('is deterministic', () => {
    const d = doc(readFixture('animated.json'));
    expect(serializeSvg(d)).toBe(serializeSvg(structuredClone(d)));
  });

  it('exports hidden layers with display="none" and never exports lock state', () => {
    const d = doc({
      version: 1,
      layers: [{ type: 'rect', id: 'r', hidden: true, locked: true, x: 0, y: 0, width: 1, height: 1 }],
    });
    const out = serializeSvg(d);
    expect(out).toContain('display="none"');
    expect(out).not.toMatch(/lock/);
  });

  it('writes the anchored transform form', () => {
    const d = doc({
      version: 1,
      layers: [
        {
          type: 'rect',
          id: 'r',
          x: 0,
          y: 0,
          width: 10,
          height: 10,
          transform: { x: 5, y: 0, scaleX: 2, scaleY: 2, rotation: 90, skewX: 0, skewY: 0, anchorX: 5, anchorY: 5 },
        },
      ],
    });
    expect(serializeSvg(d)).toContain('transform="translate(10 5) rotate(90) scale(2 2) translate(-5 -5)"');
  });

  it('names files safely', () => {
    expect(svgFileName('My: logo/v2')).toBe('My- logo-v2.svg');
    expect(svgFileName('')).toBe('drawing.svg');
  });
});
