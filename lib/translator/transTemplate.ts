// Pure parser for <Trans>-style rich strings. Mirrors the tag grammar of
// `renderRich` in lib/i18n/server.tsx (`<name>`, `</name>`, names
// [A-Za-z][A-Za-z0-9_-]*) plus react-i18next numeric tags (`<0>`, `<0/>`) and
// self-closing `<br/>`. Deliberately has no imports.

export type TransNode =
  | { type: 'text'; text: string }
  | { type: 'tag'; name: string; children: TransNode[]; selfClosing: boolean };

export type TransParseResult = { ok: true; nodes: TransNode[] } | { ok: false; error: string };

interface Token {
  index: number;
  length: number;
  closing: boolean;
  selfClosing: boolean;
  name: string;
}

function tokenize(text: string): Token[] {
  const re = /<(\/?)([A-Za-z][A-Za-z0-9_-]*|\d+)(\s*\/)?>/g;
  const tokens: Token[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const closing = m[1] === '/';
    const selfClosing = Boolean(m[3]);
    if (closing && selfClosing) continue; // `</a/>` is not a tag token
    tokens.push({ index: m.index, length: m[0].length, closing, selfClosing, name: m[2] });
  }
  return tokens;
}

/** Tag names declared by a source string (deduped, in first-seen order). */
export function declaredTags(source: string): string[] {
  const seen: string[] = [];
  for (const t of tokenize(String(source ?? ''))) {
    if (!seen.includes(t.name)) seen.push(t.name);
  }
  return seen;
}

/** True when the string contains at least one tag token. */
export function hasTransTags(text: string): boolean {
  return tokenize(String(text ?? '')).length > 0;
}

interface Frame {
  name: string | null;
  children: TransNode[];
}

/** Parse `template`, allowing only `allowedTags`. Never throws. */
export function parseTransTemplate(template: string, allowedTags: readonly string[]): TransParseResult {
  try {
    const text = String(template ?? '');
    const allowed = new Set(allowedTags);
    const stack: Frame[] = [{ name: null, children: [] }];
    const top = () => stack[stack.length - 1];
    let cursor = 0;

    for (const t of tokenize(text)) {
      if (!allowed.has(t.name)) {
        return { ok: false, error: `Tag <${t.name}> is not used by the English source` };
      }
      if (t.index > cursor) top().children.push({ type: 'text', text: text.slice(cursor, t.index) });
      cursor = t.index + t.length;

      if (t.selfClosing) {
        top().children.push({ type: 'tag', name: t.name, children: [], selfClosing: true });
      } else if (!t.closing) {
        stack.push({ name: t.name, children: [] });
      } else if (top().name === t.name) {
        const frame = stack.pop() as Frame;
        top().children.push({ type: 'tag', name: t.name, children: frame.children, selfClosing: false });
      } else if (stack.some((f) => f.name === t.name)) {
        return { ok: false, error: `Tags are crossed: </${t.name}> closes before <${top().name}>` };
      } else {
        return { ok: false, error: `Unexpected closing tag </${t.name}>` };
      }
    }

    if (stack.length > 1) {
      const open = stack.slice(1).map((f) => `<${f.name}>`);
      return { ok: false, error: `Unclosed tag${open.length > 1 ? 's' : ''}: ${open.join(', ')}` };
    }
    if (cursor < text.length) top().children.push({ type: 'text', text: text.slice(cursor) });
    return { ok: true, nodes: stack[0].children };
  } catch {
    return { ok: false, error: 'Template could not be parsed' };
  }
}
