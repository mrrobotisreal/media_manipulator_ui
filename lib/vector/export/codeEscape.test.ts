/** MM46: shared code-exporter helpers (string literals, identifiers, typed player). */
import { describe, expect, it } from 'vitest';
import ts from 'typescript';

import { PLAYER_SOURCE } from './animePlayer';
import { codeFileBase, isReservedJsWord, isValidJsIdentifier, jsString, toPascalIdentifier, typedPlayerSource } from './codeEscape';

const HOSTILE = [
  '"', "'", '`', '${x}', '*/', '/*', 'a\nb', 'a\rb', 'a\u2028b', 'a\u2029b', '</script>', ']]>', '\\', '\\u0022', '<!--', '&amp;', '"; alert(1); "', '',
];

describe('jsString', () => {
  it.each(HOSTILE.map((s) => [JSON.stringify(s), s]))('round-trips %s', (_label, input) => {
    const lit = jsString(input);
    expect(JSON.parse(lit)).toBe(input);
    expect(new Function(`return ${lit}`)()).toBe(input);
    expect(lit).not.toMatch(/[<>\n\r\u2028\u2029]/);
    expect(lit).not.toContain('</script>');
    expect(lit).not.toContain(']]>');
  });
});

describe('toPascalIdentifier', () => {
  it.each([
    ['my cool-animation', 'MyCoolAnimation'],
    ['  ', 'Animation'],
    ['', 'Animation'],
    ['3d spinner', 'Animation3dSpinner'],
    ['class', 'ClassAnimation'],
    ['Привет', 'Animation'],
    ['a*/ `${x}`', 'AX'],
    ['React', 'ReactAnimation'],
  ])('%s -> %s', (input, expected) => {
    const id = toPascalIdentifier(input, 'Animation');
    expect(id).toBe(expected);
    expect(isValidJsIdentifier(id)).toBe(true);
  });

  it('knows reserved words', () => {
    expect(isReservedJsWord('class')).toBe(true);
    expect(isReservedJsWord('Class')).toBe(true);
    expect(isValidJsIdentifier('Foo')).toBe(true);
    expect(isValidJsIdentifier('1a')).toBe(false);
  });
});

describe('codeFileBase', () => {
  it.each([
    ['My Anim!', 'My-Anim'],
    ['../../etc', 'etc'],
    ['', 'animation'],
    [undefined, 'animation'],
    ['ok_name-1', 'ok_name-1'],
  ])('%s -> %s', (input, expected) => {
    expect(codeFileBase(input)).toBe(expected);
  });
});

describe('typedPlayerSource', () => {
  it('annotates runPlayer and compiles under strict TypeScript', () => {
    const src = typedPlayerSource();
    expect(src).toContain('function runPlayer(A: any, spec: any, root: any): any {');
    expect(src).not.toBe(PLAYER_SOURCE);
    const options: ts.CompilerOptions = { strict: true, noEmit: true, target: ts.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts'], types: [] };
    const host = ts.createCompilerHost(options);
    const get = host.getSourceFile.bind(host);
    host.getSourceFile = (f, lang, ...rest) => (f === '/virtual/player.ts' ? ts.createSourceFile(f, `${src}\nexport {};\n`, lang) : get(f, lang, ...rest));
    host.fileExists = ((orig) => (f: string) => f === '/virtual/player.ts' || orig(f))(host.fileExists.bind(host));
    const program = ts.createProgram(['/virtual/player.ts'], options, host);
    const diags = ts.getPreEmitDiagnostics(program).map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
    expect(diags).toEqual([]);
  });
});
