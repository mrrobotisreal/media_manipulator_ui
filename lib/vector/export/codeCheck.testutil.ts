/** Test helper (MM46): typecheck / parse generated code with the TypeScript API. */
import { join } from 'node:path';
import ts from 'typescript';

const ROOT = join(__dirname, '..', '..', '..');

/** Diagnostics of `code` as a virtual file placed inside the repo (so node_modules resolves). */
export function typecheck(code: string, virtualName: string, extra: Partial<ts.CompilerOptions> = {}): string[] {
  const file = join(__dirname, '__golden__', virtualName);
  const options: ts.CompilerOptions = {
    strict: true,
    noEmit: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2020,
    skipLibCheck: true,
    types: [],
    ...extra,
  };
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  const readFile = host.readFile.bind(host);
  host.getSourceFile = (f, lang, ...rest) => (f === file ? ts.createSourceFile(f, code, lang) : getSourceFile(f, lang, ...rest));
  host.fileExists = (f) => f === file || fileExists(f);
  host.readFile = (f) => (f === file ? code : readFile(f));
  const program = ts.createProgram([file], options, host);
  return ts.getPreEmitDiagnostics(program).map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
}

/** Syntax diagnostics only (the `node --check` equivalent). */
export function syntaxErrors(code: string, kind: ts.ScriptKind): string[] {
  const sf = ts.createSourceFile('x', code, ts.ScriptTarget.ES2020, true, kind) as ts.SourceFile & { parseDiagnostics: ts.Diagnostic[] };
  return sf.parseDiagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
}

export { ROOT };
