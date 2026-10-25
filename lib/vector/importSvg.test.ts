import { describe, expect, it } from 'vitest';
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { parseSvg, sanitizeId, SvgImportError } from './importSvg';
import { forEachLayer, parseVectorDoc, serializeVectorDoc, type Layer } from './vectorTypes';
import { FIXTURES_DIR, readFixture, svgFixtures } from './fixtures/fixtures';

/**
 * `UPDATE_VECTOR_FIXTURES=1 npx vitest run lib/vector/importSvg.test.ts`
 * regenerates the derived fixtures (`<svg name>.json`, `defaults.json`).
 * That changes the MM43 shared contract: copy the files to
 * `media_manipulator_api/internal/vector/testdata/` in the same change.
 */
const UPDATE = process.env.UPDATE_VECTOR_FIXTURES === '1';

const svg = (body: string, attrs = 'width="100" height="100" viewBox="0 0 100 100"') =>
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ${attrs}>${body}</svg>`;

const layersOf = (body: string) => parseSvg(svg(body)).doc.layers;

describe('derived fixtures', () => {
  it.each(svgFixtures())('%s imports to its committed canonical doc', (file) => {
    const json = file.replace(/\.svg$/, '.json');
    const text = serializeVectorDoc(parseSvg(readFixture(file)).doc);
    if (UPDATE || !existsSync(join(FIXTURES_DIR, json))) writeFileSync(join(FIXTURES_DIR, json), text);
    expect(text).toBe(readFixture(json));
  });

  it('defaults.json is the canonical form of inputs/defaults.json', () => {
    const r = parseVectorDoc(readFixture('inputs', 'defaults.json'));
    if (!r.ok) throw new Error(r.error);
    const text = serializeVectorDoc(r.doc);
    if (UPDATE) writeFileSync(join(FIXTURES_DIR, 'defaults.json'), text);
    expect(text).toBe(readFixture('defaults.json'));
  });
});

describe('parseSvg: guards', () => {
  it('rejects input over 4 MB', () => {
    const big = svg(`<desc>${'x'.repeat(4 * 1024 * 1024)}</desc>`);
    expect(() => parseSvg(big)).toThrow(SvgImportError);
    try {
      parseSvg(big);
    } catch (e) {
      expect((e as SvgImportError).code).toBe('too_large');
    }
  });

  it('rejects malformed XML, non-SVG roots and entity declarations', () => {
    expect(() => parseSvg('<svg xmlns="http://www.w3.org/2000/svg"><rect></svg>')).toThrow(/well-formed/);
    expect(() => parseSvg('<html xmlns="http://www.w3.org/1999/xhtml"/>')).toThrow(/not <svg>/);
    expect(() => parseSvg('<svg><rect/></svg>')).toThrow(/not <svg>/); // no SVG namespace
    expect(() =>
      parseSvg('<!DOCTYPE svg [<!ENTITY x "y">]><svg xmlns="http://www.w3.org/2000/svg">&x;</svg>'),
    ).toThrow(/entities/);
  });
});

describe('parseSvg: security', () => {
  const nasty = readFixture('unsupported.svg');

  it('strips scripts, handlers and external references and lists them as warnings', () => {
    const { doc, warnings } = parseSvg(nasty);
    const text = serializeVectorDoc(doc);
    expect(text).not.toMatch(/<script/i);
    expect(text).not.toMatch(/\bon[a-z]+=/i);
    expect(text).not.toMatch(/javascript:/i);
    expect(text).not.toMatch(/evil\.example/);
    const codes = warnings.map((w) => w.code);
    expect(codes).toContain('script_removed');
    expect(codes).toContain('event_handler_removed');
    expect(codes).toContain('external_reference_removed');
    expect(codes).toContain('unsupported_element');
  });

  it('removes handlers inside raw markup too', () => {
    const { doc } = parseSvg(svg('<foreignObject width="10" height="10"><div xmlns="http://www.w3.org/1999/xhtml" onmouseover="x()">hi</div></foreignObject>'));
    const raw = doc.layers[0];
    expect(raw.type).toBe('raw');
    expect(raw.type === 'raw' && raw.markup).not.toMatch(/onmouseover/);
  });

  it('drops dangerous elements and SMIL that targets href', () => {
    const { doc } = parseSvg(
      svg('<iframe src="x"/><a href="#t"><set attributeName="href" to="javascript:alert(1)"/></a><rect id="t" width="1" height="1"/>'),
    );
    const text = serializeVectorDoc(doc);
    expect(text).not.toMatch(/iframe|javascript|<set/);
  });

  it('keeps only data: image hrefs', () => {
    const png = 'data:image/png;base64,iVBORw0KGgo=';
    const layers = layersOf(`<image href="${png}" width="1" height="1"/><image href="http://x/y.png" width="1" height="1"/><image href="data:text/html;base64,PHNjcmlwdD4=" width="1" height="1"/>`);
    expect(layers).toHaveLength(1);
    expect(layers[0]).toMatchObject({ type: 'image', href: png });
  });

  it('drops style declarations that reach the network', () => {
    const { doc, warnings } = parseSvg(svg('<rect width="1" height="1" style="fill:url(http://x/y);stroke:red;behavior:url(x.htc)"/>'));
    expect(doc.layers[0]).toMatchObject({ stroke: 'red' });
    expect(doc.layers[0]).not.toHaveProperty('fill');
    expect(warnings.some((w) => w.code === 'external_reference_removed' || w.code === 'unsafe_content_removed')).toBe(true);
  });
});

describe('parseSvg: normalisation', () => {
  it('resolves style="" into fields and canonicalises numbers', () => {
    const [r] = layersOf('<rect x="1.00000" y="+2" width="1e1" height=".5" style="fill: #fff ; stroke-width:0.123456; opacity:50%"/>');
    expect(r).toMatchObject({ type: 'rect', x: 1, y: 2, width: 10, height: 0.5, fill: '#fff', strokeWidth: 0.123, opacity: 0.5 });
  });

  it('inlines simple stylesheets by specificity and removes them', () => {
    const { doc } = parseSvg(
      svg('<style>.a { fill: red } rect { stroke: blue } #b { fill: green }</style><rect class="a" width="1" height="1"/><rect id="b" class="a" width="1" height="1"/>'),
    );
    expect(doc.layers).toHaveLength(2);
    expect(doc.layers[0]).toMatchObject({ fill: 'red', stroke: 'blue', attrs: { class: 'a' } });
    expect(doc.layers[1]).toMatchObject({ fill: 'green', stroke: 'blue' });
  });

  it('keeps a complex stylesheet as a raw layer', () => {
    const { doc } = parseSvg(svg('<style>g > rect:hover { fill: red }</style><rect width="1" height="1"/>'));
    expect(doc.layers[0].type).toBe('raw');
  });

  it('drops editor metadata and namespaced attributes, keeps the Inkscape label as the name', () => {
    const { doc } = parseSvg(
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="10" height="10"><sodipodi:namedview/><metadata/><!-- c --><g inkscape:groupmode="layer" inkscape:label="Layer 1"><rect width="1" height="1"/></g></svg>',
    );
    expect(doc.layers).toHaveLength(1);
    expect(doc.layers[0]).toMatchObject({ type: 'group', name: 'Layer 1' });
    expect(serializeVectorDoc(doc)).not.toMatch(/inkscape|sodipodi|groupmode/);
  });

  it('sanitises and de-duplicates ids, rewriting references', () => {
    const { doc } = parseSvg(
      svg('<linearGradient id="1grad"><stop offset="0" stop-color="red"/></linearGradient><rect id="a" width="1" height="1" fill="url(#1grad)"/><rect id="a" width="1" height="1"/>'),
    );
    expect(doc.defs.gradients[0].id).toBe('_1grad');
    expect(doc.layers[0]).toMatchObject({ id: 'a', fill: 'url(#_1grad)' });
    expect(doc.layers[1].id).toBe('a-2');
    expect(sanitizeId('9 lives!')).toBe('_9_lives_');
  });

  it('maps circle to an ellipse and path data to canonical absolute form', () => {
    const [c, p] = layersOf('<circle cx="5" cy="5" r="2"/><path d="m1 1 h 2 v 2 z"/>');
    expect(c).toMatchObject({ type: 'ellipse', rx: 2, ry: 2 });
    expect(p).toMatchObject({ type: 'path', d: 'M1 1L3 1L3 3Z' });
  });

  it('keeps malformed path data as raw rather than dropping it', () => {
    expect(layersOf('<path d="L 1 1"/>')[0].type).toBe('raw');
  });

  it('maps canonical transforms with an anchor exactly and decomposes the rest', () => {
    const [a, b] = layersOf('<rect width="1" height="1" transform="rotate(45 10 20)"/><rect width="1" height="1" transform="matrix(2 0 0 3 4 5)"/>');
    expect((a as Extract<Layer, { type: 'rect' }>).transform).toMatchObject({ rotation: 45, anchorX: 10, anchorY: 20, x: 0, y: 0 });
    expect((b as Extract<Layer, { type: 'rect' }>).transform).toMatchObject({ scaleX: 2, scaleY: 3, x: 4, y: 5 });
  });

  it('reads canvas size from units and falls back to the viewBox', () => {
    expect(parseSvg(svg('', 'width="1in" height="72pt"')).doc.canvas).toMatchObject({ width: 96, height: 96 });
    expect(parseSvg(svg('', 'viewBox="0 0 30 40"')).doc.canvas).toMatchObject({ width: 30, height: 40 });
    expect(parseSvg(svg('', '')).doc.canvas).toMatchObject({ width: 512, height: 512 });
  });

  it('turns percentage lengths into user units', () => {
    const [r] = layersOf('<rect width="50%" height="25%"/>');
    expect(r).toMatchObject({ width: 50, height: 25 });
  });

  it('replaces dangling references with their fallback and warns', () => {
    const { doc, warnings } = parseSvg(svg('<rect width="1" height="1" fill="url(#nope) blue" mask="url(#m)"/><use href="#ghost"/>'));
    expect(doc.layers).toHaveLength(1);
    expect(doc.layers[0]).toMatchObject({ fill: 'blue' });
    expect(doc.layers[0]).not.toHaveProperty('mask');
    expect(warnings.filter((w) => w.code === 'dangling_reference')).toHaveLength(3);
  });

  it('breaks use cycles', () => {
    const { doc } = parseSvg(svg('<symbol id="a"><use href="#b"/></symbol><symbol id="b"><use href="#a"/></symbol><use href="#a"/>'));
    let uses = 0;
    forEachLayer(doc, (l) => {
      if (l.type === 'use') uses++;
    });
    expect(uses).toBe(0);
  });

  it('keeps unknown-but-safe presentation attributes in attrs', () => {
    const [r] = layersOf('<rect width="1" height="1" paint-order="stroke" vector-effect="non-scaling-stroke" data-x="1" foo="bar"/>');
    expect((r as Extract<Layer, { type: 'rect' }>).attrs).toEqual({ 'paint-order': 'stroke', 'vector-effect': 'non-scaling-stroke', 'data-x': '1' });
  });

  it('imports a simple single blur filter into defs and others as raw', () => {
    const { doc } = parseSvg(
      svg('<filter id="b"><feGaussianBlur stdDeviation="2"/></filter><filter id="c"><feOffset dx="1"/></filter><rect width="1" height="1" filter="url(#b)"/>'),
    );
    expect(doc.defs.filters).toEqual([{ type: 'blur', id: 'b', stdDeviation: 2 }]);
    expect(doc.layers[0]).toMatchObject({ type: 'raw', ids: ['c'] });
  });

  it('leaves animations empty', () => {
    expect(parseSvg(readFixture('shapes.svg')).doc.animations).toEqual([]);
  });
});
