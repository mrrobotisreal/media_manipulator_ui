import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { declaredTags, hasTransTags, parseTransTemplate } from './transTemplate';

const t = (text: string) => ({ type: 'text', text });
const tag = (name: string, children: unknown[] = [], selfClosing = false) => ({
  type: 'tag', name, children, selfClosing,
});

describe('Trans template parser: valid templates', () => {
  const cases: [string, string, string[], unknown[]][] = [
    ['plain text', 'Hello', [], [t('Hello')]],
    ['named tag', 'built by <strong>CreaTV Ltd.</strong>', ['strong'], [t('built by '), tag('strong', [t('CreaTV Ltd.')])]],
    ['numeric tag', '<0>Hello</0> world', ['0'], [tag('0', [t('Hello')]), t(' world')]],
    ['two named tags', 'See <linkHow>how</linkHow> or <linkTools>all</linkTools>', ['linkHow', 'linkTools'],
      [t('See '), tag('linkHow', [t('how')]), t(' or '), tag('linkTools', [t('all')])]],
    ['nested tags', '<a1><b-2>x</b-2></a1>', ['a1', 'b-2'], [tag('a1', [tag('b-2', [t('x')])])]],
    ['self-closing br', 'a<br/>b', ['br'], [t('a'), tag('br', [], true), t('b')]],
    ['self-closing br with space', 'a<br />b', ['br'], [t('a'), tag('br', [], true), t('b')]],
    ['self-closing numeric', 'a<0/>b', ['0'], [t('a'), tag('0', [], true), t('b')]],
    ['literal less-than', 'a < b', [], [t('a < b')]],
    ['empty angle brackets', 'x <> y', [], [t('x <> y')]],
    ['space after bracket', '< b>x', ['b'], [t('< b>x')]],
    ['placeholders stay literal', 'Hi {{name}}, <strong>{{count}}</strong>', ['strong'],
      [t('Hi {{name}}, '), tag('strong', [t('{{count}}')])]],
    ['attributes make it literal text', '<img src=x onerror=alert(1)>', ['img'], [t('<img src=x onerror=alert(1)>')]],
    ['empty string', '', [], []],
  ];
  it.each(cases)('Trans template parser: %s', (_n, template, allowed, nodes) => {
    expect(parseTransTemplate(template, allowed)).toEqual({ ok: true, nodes });
  });
});

describe('Trans template parser: errors', () => {
  const cases: [string, string, string[], RegExp][] = [
    ['unknown tag not in the English source', 'Hi <script>alert(1)</script>', ['strong'], /Tag <script> is not used by the English source/],
    ['allowed set excluding script rejects closing-only script', 'x</script>', ['strong'], /<script>/],
    ['unexpected closing tag', 'a </strong> b', ['strong'], /Unexpected closing tag <\/strong>/],
    ['unclosed tag', '<strong>a', ['strong'], /Unclosed tag: <strong>/],
    ['several unclosed tags', '<a><b>x', ['a', 'b'], /Unclosed tags: <a>, <b>/],
    ['crossed nesting', '<a><b></a></b>', ['a', 'b'], /crossed/i],
    ['closing for the wrong tag', '<a>x</b>', ['a', 'b'], /Unexpected closing tag <\/b>|crossed/i],
  ];
  it.each(cases)('Trans template parser: %s', (_n, template, allowed, re) => {
    const r = parseTransTemplate(template, allowed);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(re);
  });
});

describe('declaredTags / hasTransTags', () => {
  it('declaredTags: dedupes and keeps first-seen order', () => {
    expect(declaredTags('<b>a</b> <i>c</i> <b>d</b><br/>')).toEqual(['b', 'i', 'br']);
  });
  it('declaredTags: numeric tags and no tags', () => {
    expect(declaredTags('<0>a</0><1/>')).toEqual(['0', '1']);
    expect(declaredTags('a < b {{x}}')).toEqual([]);
  });
  it.each([
    ['<b>x</b>', true], ['x</b>', true], ['a<br/>', true], ['<0>x', true],
    ['plain', false], ['a < b', false], ['<>', false], ['{{x}}', false], ['', false],
  ])('hasTransTags(%j) is %s', (text, expected) => {
    expect(hasTransTags(text)).toBe(expected);
  });
});

describe('Trans template parser: robustness', () => {
  it('never throws on weird inputs', () => {
    const weird = ['<', '>', '<<<>>>', '</', '<a', '<a/', '</a/>', '<0', '\u0000<a>', '<a>'.repeat(500),
      '<'.repeat(10000), '<a b="c">', '<!-- x -->', '<?xml?>', undefined as unknown as string, null as unknown as string];
    for (const w of weird) {
      expect(() => parseTransTemplate(w, ['a', '0'])).not.toThrow();
      expect(() => declaredTags(w)).not.toThrow();
      expect(() => hasTransTags(w)).not.toThrow();
    }
  });
  it('transTemplate.ts has no import statements', () => {
    const src = readFileSync(join(__dirname, 'transTemplate.ts'), 'utf8');
    expect(src).not.toMatch(/^\s*import\s/m);
    expect(src).not.toMatch(/\brequire\(/);
  });
});
