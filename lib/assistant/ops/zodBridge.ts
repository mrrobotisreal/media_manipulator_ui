/**
 * MM108: a copy of an editor's Zod v3 document schema as a Zod v4 schema for Medi's op
 * contract. The editors' documents stay on Zod v3 (`zod`); the op vocabularies are written in
 * Zod v4 (`zod/v4`, shipped inside the same `zod@3.25` package) because v4 compiles to JSON
 * Schema natively (`z.toJSONSchema`), which the API validates with before streaming.
 *
 * The copy is STRICT where the document is lenient: unknown keys are refused (the document
 * passes them through) and out-of-range numbers are refused (the document clamps them), so a
 * model that names a parameter that does not exist, or a value outside its range, is told so
 * instead of being silently corrected. A field is optional when the document gives it a default
 * (or it is optional); everything else is required, exactly as in the document.
 */
import { z } from 'zod/v4';

interface V3 {
  _def: { typeName: string; [k: string]: unknown };
}

type V4 = z.ZodType;

function unwrapEffects(s: V3): V3 {
  let cur = s;
  for (let i = 0; i < 8 && cur._def.typeName === 'ZodEffects'; i += 1) cur = cur._def.schema as V3;
  return cur;
}

/** Strip default/optional/effects; report whether the field may be omitted and whether it is nullable. */
function peel(s: V3): { inner: V3; optional: boolean; nullable: boolean } {
  let cur = s;
  let optional = false;
  let nullable = false;
  for (let i = 0; i < 12; i += 1) {
    const t = cur._def.typeName;
    if (t === 'ZodDefault' || t === 'ZodOptional') {
      optional = true;
      cur = cur._def.innerType as V3;
    } else if (t === 'ZodNullable') {
      nullable = true;
      cur = cur._def.innerType as V3;
    } else if (t === 'ZodEffects') {
      cur = cur._def.schema as V3;
    } else break;
  }
  return { inner: cur, optional, nullable };
}

const shapeOf = (s: V3): Record<string, V3> => {
  const sh = s._def.shape as (() => Record<string, V3>) | Record<string, V3>;
  return typeof sh === 'function' ? sh() : sh;
};

export interface BridgeOptions {
  /** Object keys to leave out (e.g. a LUT's `cube` text, which a model must never write). */
  omit?: readonly string[];
}

/** The v4 copy of one v3 schema node (without its optional/nullable wrapper). */
export function bridge(schema: unknown, opts: BridgeOptions = {}): V4 {
  const s = unwrapEffects(schema as V3);
  const d = s._def;
  switch (d.typeName) {
    case 'ZodDefault':
    case 'ZodOptional':
    case 'ZodNullable':
    case 'ZodEffects': {
      const p = peel(s);
      const inner = bridge(p.inner, opts);
      return p.nullable ? inner.nullable() : inner;
    }
    case 'ZodObject': {
      const out: Record<string, V4> = {};
      for (const [k, v] of Object.entries(shapeOf(s))) {
        if (opts.omit?.includes(k)) continue;
        const p = peel(v);
        let f = bridge(p.inner, opts);
        if (p.nullable) f = f.nullable();
        out[k] = p.optional ? f.optional() : f;
      }
      return z.strictObject(out);
    }
    case 'ZodNumber': {
      const checks = (d.checks ?? []) as Array<{ kind: string; value?: number }>;
      let n = checks.some((c) => c.kind === 'int') ? z.number().int() : z.number();
      for (const c of checks) {
        if (c.kind === 'min' && c.value !== undefined) n = n.min(c.value);
        if (c.kind === 'max' && c.value !== undefined) n = n.max(c.value);
      }
      return n;
    }
    case 'ZodBoolean':
      return z.boolean();
    case 'ZodString': {
      let t = z.string();
      for (const c of (d.checks ?? []) as Array<{ kind: string; value?: number; regex?: RegExp }>) {
        if (c.kind === 'regex' && c.regex) t = t.regex(c.regex);
        if (c.kind === 'max' && c.value !== undefined) t = t.max(c.value);
        if (c.kind === 'min' && c.value !== undefined) t = t.min(c.value);
      }
      return t;
    }
    case 'ZodEnum':
      return z.enum(d.values as [string, ...string[]]);
    case 'ZodLiteral':
      return z.literal(d.value as string | number | boolean);
    case 'ZodNull':
      return z.null();
    case 'ZodArray': {
      let a = z.array(bridge(d.type, opts));
      const min = (d.minLength as { value: number } | null)?.value;
      const max = (d.maxLength as { value: number } | null)?.value;
      if (min !== undefined) a = a.min(min);
      if (max !== undefined) a = a.max(max);
      return a;
    }
    case 'ZodDiscriminatedUnion':
    case 'ZodUnion': {
      const options = (d.options as V3[]).map((o) => bridge(o, opts));
      return z.union(options as [V4, V4, ...V4[]]);
    }
    default:
      throw new Error(`zodBridge: unsupported Zod type ${d.typeName}`);
  }
}
