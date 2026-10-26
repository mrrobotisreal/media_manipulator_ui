/**
 * Stable JSON reader/writer for locale shards (MM54 decision 8; research §7).
 *
 * `JSON.parse` + `JSON.stringify(obj, null, 2)` is NOT byte-stable on this repo:
 * V8 orders integer-like keys (`"1080"`, `"720"`, `"480"`) numerically before
 * every other key, and 34 real shards (`interface/forms.json` and
 * `interface/panels.json` of each locale: `videoCompressor.resolutions`,
 * `videoTransform.rotations`, `conversionOptions…options`) depend on their
 * written order. So this module parses into an ORDERED tree (entries arrays,
 * never JS objects) and prints it exactly as `JSON.stringify(value, null, 2) + "\n"`
 * would print the same data with its keys in file order: 2-space indent, `[]`/`{}`
 * for empty containers, strings and numbers through `JSON.stringify` (the
 * repo's escaping). `writeJson(parseJson(text)) === text` holds for every shard
 * (`stableJson.test.ts` runs it over all of `i18n/locales/**`).
 *
 * Keys: the panel and the request body carry i18next's dotted key (`a.b.c`,
 * `items.0.title`, `foo_few`). Real keys contain dots (`models["rife-v4.6"]`),
 * so a dotted key is RESOLVED against the file's tree, segment by segment, to a
 * path array; a dotted key that could map to two leaves is refused (none does
 * today: checked over every shard of every locale). New keys are allowed only as
 * missing plural forms of an existing group and are inserted right after the
 * group's last existing sibling.
 *
 * Zero imports: shared by the Node route and tests.
 */

export type JsonNode =
  | { t: 'obj'; entries: Array<[string, JsonNode]> }
  | { t: 'arr'; items: JsonNode[] }
  | { t: 'str'; v: string }
  | { t: 'num'; v: number }
  | { t: 'bool'; v: boolean }
  | { t: 'null' };

export class StableJsonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StableJsonError';
  }
}

/* ------------------------------------------------------------------------- */
/* Parse                                                                      */
/* ------------------------------------------------------------------------- */

const WS = new Set([' ', '\t', '\n', '\r']);

export function parseJson(text: string): JsonNode {
  let i = 0;
  const ws = () => {
    while (i < text.length && WS.has(text[i])) i++;
  };
  const fail = (what: string): never => {
    throw new StableJsonError(`${what} at offset ${i}`);
  };
  const str = (): string => {
    const start = i;
    i++; // opening quote
    while (i < text.length) {
      const c = text[i];
      if (c === '\\') i += 2;
      else if (c === '"') break;
      else i++;
    }
    if (text[i] !== '"') fail('unterminated string');
    i++;
    // The literal is valid JSON on its own; JSON.parse decodes escapes exactly.
    try {
      return JSON.parse(text.slice(start, i)) as string;
    } catch {
      return fail('invalid string');
    }
  };
  const value = (depth: number): JsonNode => {
    if (depth > 64) fail('nesting too deep');
    ws();
    const c = text[i];
    if (c === '{') {
      i++;
      const entries: Array<[string, JsonNode]> = [];
      const seen = new Set<string>();
      ws();
      if (text[i] === '}') {
        i++;
        return { t: 'obj', entries };
      }
      for (;;) {
        ws();
        if (text[i] !== '"') fail('expected key');
        const k = str();
        if (seen.has(k)) fail(`duplicate key ${JSON.stringify(k)}`);
        seen.add(k);
        ws();
        if (text[i] !== ':') fail('expected ":"');
        i++;
        entries.push([k, value(depth + 1)]);
        ws();
        if (text[i] === ',') {
          i++;
          continue;
        }
        if (text[i] === '}') {
          i++;
          return { t: 'obj', entries };
        }
        fail('expected "," or "}"');
      }
    }
    if (c === '[') {
      i++;
      const items: JsonNode[] = [];
      ws();
      if (text[i] === ']') {
        i++;
        return { t: 'arr', items };
      }
      for (;;) {
        items.push(value(depth + 1));
        ws();
        if (text[i] === ',') {
          i++;
          continue;
        }
        if (text[i] === ']') {
          i++;
          return { t: 'arr', items };
        }
        fail('expected "," or "]"');
      }
    }
    if (c === '"') return { t: 'str', v: str() };
    if (text.startsWith('true', i)) {
      i += 4;
      return { t: 'bool', v: true };
    }
    if (text.startsWith('false', i)) {
      i += 5;
      return { t: 'bool', v: false };
    }
    if (text.startsWith('null', i)) {
      i += 4;
      return { t: 'null' };
    }
    const m = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(text.slice(i, i + 64));
    if (m) {
      i += m[0].length;
      return { t: 'num', v: Number(m[0]) };
    }
    return fail('unexpected token');
  };
  const root = value(0);
  ws();
  if (i !== text.length) fail('trailing content');
  return root;
}

/* ------------------------------------------------------------------------- */
/* Write                                                                      */
/* ------------------------------------------------------------------------- */

/** `JSON.stringify(data, null, 2) + "\n"` with the tree's key order. */
export function writeJson(node: JsonNode): string {
  const out: string[] = [];
  const emit = (n: JsonNode, indent: string) => {
    switch (n.t) {
      case 'str':
        out.push(JSON.stringify(n.v));
        return;
      case 'num':
        out.push(JSON.stringify(n.v));
        return;
      case 'bool':
        out.push(n.v ? 'true' : 'false');
        return;
      case 'null':
        out.push('null');
        return;
      case 'arr': {
        if (n.items.length === 0) {
          out.push('[]');
          return;
        }
        const inner = indent + '  ';
        out.push('[\n');
        n.items.forEach((item, idx) => {
          out.push(inner);
          emit(item, inner);
          out.push(idx < n.items.length - 1 ? ',\n' : '\n');
        });
        out.push(indent, ']');
        return;
      }
      case 'obj': {
        if (n.entries.length === 0) {
          out.push('{}');
          return;
        }
        const inner = indent + '  ';
        out.push('{\n');
        n.entries.forEach(([k, v], idx) => {
          out.push(inner, JSON.stringify(k), ': ');
          emit(v, inner);
          out.push(idx < n.entries.length - 1 ? ',\n' : '\n');
        });
        out.push(indent, '}');
      }
    }
  };
  emit(node, '');
  out.push('\n');
  return out.join('');
}

/* ------------------------------------------------------------------------- */
/* Keys                                                                       */
/* ------------------------------------------------------------------------- */

function child(node: JsonNode, seg: string): JsonNode | undefined {
  if (node.t === 'obj') return node.entries.find(([k]) => k === seg)?.[1];
  if (node.t === 'arr' && /^(0|[1-9]\d*)$/.test(seg)) return node.items[Number(seg)];
  return undefined;
}

/** The node at a path array, or undefined. */
export function getAt(root: JsonNode, path: readonly string[]): JsonNode | undefined {
  let n: JsonNode | undefined = root;
  for (const seg of path) {
    if (!n) return undefined;
    n = child(n, seg);
  }
  return n;
}

/**
 * Every path array whose dotted join is `key` and that ends at a STRING leaf.
 * (Object keys may themselves contain dots, so one dotted key can in principle
 * name several leaves.)
 */
export function resolveDottedKeyAll(root: JsonNode, key: string): string[][] {
  const found: string[][] = [];
  const walk = (n: JsonNode, rest: string, path: string[]) => {
    if (found.length > 1) return;
    if (n.t === 'obj') {
      for (const [k, v] of n.entries) {
        if (rest === k) {
          if (v.t === 'str') found.push([...path, k]);
        } else if (rest.startsWith(`${k}.`)) {
          walk(v, rest.slice(k.length + 1), [...path, k]);
        }
      }
    } else if (n.t === 'arr') {
      const dot = rest.indexOf('.');
      const seg = dot === -1 ? rest : rest.slice(0, dot);
      if (!/^(0|[1-9]\d*)$/.test(seg)) return;
      const v = n.items[Number(seg)];
      if (!v) return;
      if (dot === -1) {
        if (v.t === 'str') found.push([...path, seg]);
      } else {
        walk(v, rest.slice(dot + 1), [...path, seg]);
      }
    }
  };
  if (key) walk(root, key, []);
  return found;
}

/** The single string leaf a dotted key names; null when absent; throws when ambiguous. */
export function resolveDottedKey(root: JsonNode, key: string): string[] | null {
  const all = resolveDottedKeyAll(root, key);
  if (all.length > 1) throw new StableJsonError(`key ${JSON.stringify(key)} is ambiguous in this file`);
  return all[0] ?? null;
}

const PLURAL_SUFFIXES = ['zero', 'one', 'two', 'few', 'many', 'other'] as const;

/** `foo.bar_few` -> { base: 'foo.bar', category: 'few' } (same rule as validators.splitPluralKey). */
function splitPlural(key: string): { base: string; category: string } | null {
  const i = key.lastIndexOf('_');
  if (i <= 0) return null;
  const category = key.slice(i + 1);
  if (!(PLURAL_SUFFIXES as readonly string[]).includes(category)) return null;
  const base = key.slice(0, i);
  if (base === '' || base.endsWith('.')) return null;
  return { base, category };
}

export type KeyTarget =
  | { kind: 'existing'; path: string[]; value: string }
  | { kind: 'new'; parent: string[]; name: string; after: string };

/**
 * Where a change for `key` lands in `root`: an existing string leaf, or a new
 * plural form of an existing group (placed after the group's last sibling).
 * Null: the key is unknown (not in the file and not a plural form of a group
 * that is). `allowedCategories` limits which new forms may be created.
 */
export function locateKey(root: JsonNode, key: string, allowedCategories: readonly string[]): KeyTarget | null {
  const path = resolveDottedKey(root, key);
  if (path) {
    const leaf = getAt(root, path);
    return leaf?.t === 'str' ? { kind: 'existing', path, value: leaf.v } : null;
  }
  const split = splitPlural(key);
  if (!split || !allowedCategories.includes(split.category)) return null;
  // Find an existing sibling form to learn the parent object and the leaf's base name.
  let parent: string[] | null = null;
  let baseName: string | null = null;
  for (const c of PLURAL_SUFFIXES) {
    if (c === split.category) continue;
    const sib = resolveDottedKey(root, `${split.base}_${c}`);
    if (sib) {
      const p = sib.slice(0, -1);
      const name = sib[sib.length - 1];
      if (parent && p.join('\u0000') !== parent.join('\u0000')) {
        throw new StableJsonError(`plural group ${JSON.stringify(split.base)} is split across objects`);
      }
      parent = p;
      baseName = name.slice(0, name.length - c.length - 1);
    }
  }
  if (!parent || baseName === null) return null;
  const obj = getAt(root, parent);
  if (!obj || obj.t !== 'obj') return null;
  const name = `${baseName}_${split.category}`;
  // After the LAST existing sibling of the group, in file order.
  let after = '';
  for (const [k] of obj.entries) {
    const s = splitPlural(k);
    if (s && s.base === baseName) after = k;
  }
  return { kind: 'new', parent, name, after };
}

/** Sets a string at an existing leaf (`existing`) or inserts it (`new`). Mutates `root`. */
export function applyAt(root: JsonNode, target: KeyTarget, value: string): void {
  if (target.kind === 'existing') {
    const parent = getAt(root, target.path.slice(0, -1));
    const last = target.path[target.path.length - 1];
    if (parent?.t === 'obj') {
      const entry = parent.entries.find(([k]) => k === last);
      if (!entry || entry[1].t !== 'str') throw new StableJsonError('target is not a string leaf');
      entry[1] = { t: 'str', v: value };
    } else if (parent?.t === 'arr') {
      const idx = Number(last);
      if (parent.items[idx]?.t !== 'str') throw new StableJsonError('target is not a string leaf');
      parent.items[idx] = { t: 'str', v: value };
    } else {
      throw new StableJsonError('target parent missing');
    }
    return;
  }
  const obj = getAt(root, target.parent);
  if (!obj || obj.t !== 'obj') throw new StableJsonError('target parent missing');
  if (obj.entries.some(([k]) => k === target.name)) {
    const entry = obj.entries.find(([k]) => k === target.name)!;
    entry[1] = { t: 'str', v: value };
    return;
  }
  // Re-derive the group's last sibling NOW: several new forms of one group are
  // located before any is applied, and each must land after the previous one.
  const group = splitPlural(target.name)?.base;
  let at = obj.entries.findIndex(([k]) => k === target.after);
  if (group !== undefined) {
    obj.entries.forEach(([k], idx) => {
      if (splitPlural(k)?.base === group) at = idx;
    });
  }
  obj.entries.splice(at === -1 ? obj.entries.length : at + 1, 0, [target.name, { t: 'str', v: value }]);
}

/** Every string leaf as `dotted.key -> value` (array items as `.N`), in file order. */
export function flattenNode(root: JsonNode): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (n: JsonNode, path: string) => {
    if (n.t === 'str') {
      if (path) out[path] = n.v;
    } else if (n.t === 'arr') {
      n.items.forEach((v, i) => walk(v, path ? `${path}.${i}` : String(i)));
    } else if (n.t === 'obj') {
      for (const [k, v] of n.entries) walk(v, path ? `${path}.${k}` : k);
    }
  };
  walk(root, '');
  return out;
}
