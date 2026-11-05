/**
 * MM116a: the `?o=<base64url JSON>` deep link. Medi's `open_tool` carries `options`; the UI
 * encodes them into the link and the tool page validates them against the tool's own option
 * schema before prefilling the form. Untrusted input: capped in size, strict (unknown keys and
 * out-of-range values are refused, never clamped), and a bad link degrades to the plain tool page.
 */
import { z } from 'zod/v4';

import type { OptionsSpec } from './schemas';

/** Longest `o` value accepted, in characters of base64url (about 1.5 KB of JSON). */
export const MAX_OPTIONS_PARAM_CHARS = 2048;
/** Longest JSON text after decoding. */
export const MAX_OPTIONS_JSON_CHARS = 1536;
export const OPTIONS_PARAM = 'o';

export type OptionValues = Record<string, unknown>;

export type DecodeResult =
  | { ok: true; options: OptionValues }
  | { ok: false; reason: 'empty' | 'oversized' | 'not_base64url' | 'not_json' | 'not_object' | 'no_options' | 'invalid'; issues?: string[] };

const B64URL = /^[A-Za-z0-9_-]+$/;

export function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): string | null {
  try {
    const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/** The `o` value for a set of options (no validation: callers hold validated options). */
export function encodeOptions(options: OptionValues): string {
  return toBase64Url(JSON.stringify(options));
}

/** Decode and validate a raw `o` value against a tool's options. Never throws. */
export function decodeOptions(raw: string | null | undefined, spec: OptionsSpec): DecodeResult {
  if (!raw) return { ok: false, reason: 'empty' };
  if (raw.length > MAX_OPTIONS_PARAM_CHARS) return { ok: false, reason: 'oversized' };
  if (!B64URL.test(raw)) return { ok: false, reason: 'not_base64url' };
  const json = fromBase64Url(raw);
  if (json === null) return { ok: false, reason: 'not_base64url' };
  if (json.length > MAX_OPTIONS_JSON_CHARS) return { ok: false, reason: 'oversized' };
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    return { ok: false, reason: 'not_json' };
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { ok: false, reason: 'not_object' };
  if (spec.kind === 'none') return { ok: false, reason: 'no_options' };
  const parsed = (spec.schema as unknown as z.ZodType<OptionValues>).safeParse(value);
  if (!parsed.success) {
    return { ok: false, reason: 'invalid', issues: parsed.error.issues.slice(0, 5).map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`) };
  }
  return { ok: true, options: parsed.data };
}
