import { describe, expect, it } from 'vitest';

import { buildRawNodes } from './rawRender';
import { rawMarkupIssues } from './vectorTypes';

const html = (nodes: Node[]) => {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.replaceChildren(...nodes);
  return g.innerHTML;
};

describe('raw layer rendering (no innerHTML)', () => {
  it('rebuilds allowed SVG and prefixes ids and references', () => {
    const out = html(buildRawNodes('<pattern id="dots" width="10" height="10"><circle cx="5" cy="5" r="2" fill="url(#g)"/></pattern>', 'v-'));
    expect(out).toContain('id="v-dots"');
    expect(out).toContain('fill="url(#v-g)"');
    expect(out).toContain('<circle');
  });

  it.each([
    ['CDATA breakout', '<foreignObject width="10" height="10"><div xmlns="http://www.w3.org/1999/xhtml"><![CDATA[><iframe/srcdoc="x">]]></div></foreignObject>'],
    ['plain iframe', '<foreignObject><iframe xmlns="http://www.w3.org/1999/xhtml" srcdoc="&lt;script&gt;alert(1)&lt;/script&gt;"></iframe></foreignObject>'],
    ['entity javascript in SMIL', '<a href="#"><set attributeName="href" to="&#106;avascript:alert(1)"/><text>x</text></a>'],
    ['unquoted external href', '<image href=https://evil.test/x.png width="1" height="1"/>'],
    ['escaped @import', '<style>@\\69mport "https://evil.test/x.css";</style>'],
    ['escaped url in style attr', '<rect style="background:\\75rl(https://evil.test/x)"/>'],
    ['image-set', '<rect style="fill:image-set(\'https://e/x\' 1x)"/>'],
  ])('rejects %s in the shared rules and renders nothing', (_name, markup) => {
    expect(rawMarkupIssues(markup).length).toBeGreaterThan(0);
    expect(buildRawNodes(markup, '')).toEqual([]);
  });

  it('never creates HTML or non-allowlisted elements even when the rules pass', () => {
    const out = html(buildRawNodes('<switch><rect width="1" height="1"/><unknownThing/></switch><a><rect width="2" height="2"/></a>', ''));
    expect(out).not.toMatch(/unknownThing|<a[\s>]/);
    expect(out).toContain('<switch>');
    expect(out).toContain('<g><rect');
  });

  it('drops event handlers and href animations', () => {
    const out = html(buildRawNodes('<g><animate attributeName="href" values="#a;#b"/><rect width="1" height="1"/></g>', ''));
    expect(out).not.toMatch(/animate/);
  });
});
