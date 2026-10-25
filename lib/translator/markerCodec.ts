/**
 * Zero-width key-marker codec (MM52, design §2.9; Tolgee technique, research §2.2).
 *
 * Pure and dependency-free. A marker is an invisible run appended AFTER the
 * visible text of a translated string; it encodes a numeric index into the key
 * registry (`lib/translator/keyRegistry.ts`).
 *
 * WIRE FORMAT (fixed width; every unit is 9 chars, a marker is 7 units = 63 chars):
 *
 *   marker = 6 data groups + 1 terminator
 *   group  = U+200C, 7 data bits (MSB first), U+200C          (9 chars)
 *   term   = 8 x U+200D, U+200C                                (9 chars)
 *   bit 0  = U+200C ZERO WIDTH NON-JOINER
 *   bit 1  = U+200D ZERO WIDTH JOINER
 *
 * Why this framing (a deviation from the ticket's proposed 8-bit groups, see
 * `docs/design/TRANSLATOR_WORKBENCH.md` §7 MM52):
 *   - Every marker STARTS and ENDS with U+200C. U+200D is join-causing: placed
 *     right after an Arabic letter it would switch the letter to its medial or
 *     initial form, and placed before the next string's first letter it would do
 *     the same there. U+200C is non-joining, so the letters on both sides shape
 *     exactly as they do at the end/start of the text. Both chars are Bidi_Class
 *     BN, which the bidi algorithm ignores, so RTL ordering is unaffected.
 *   - Inside the payload every group is wrapped in U+200C, so at most 7 U+200D
 *     ever follow each other there. Eight U+200D then U+200C occur only in the
 *     terminator, which makes markers self-delimiting: the decoder anchors on the
 *     terminator and reads the 54 chars before it, so adjacent translations in
 *     one text node, and genuine joiners the text itself uses (Hindi conjuncts,
 *     emoji ZWJ sequences), never confuse it.
 *
 * Index range: 6 x 7 = 42 bits; the registry uses 40 (8-bit locale slot + a
 * 32-bit key hash), `MAX_MARKER_INDEX`.
 */

export const ZWNJ = '‌';
export const ZWJ = '‍';

const DATA_BITS = 7;
const GROUP = DATA_BITS + 2;
const GROUPS = 6;
const PAYLOAD_CHARS = GROUPS * GROUP;
const TERMINATOR = ZWJ.repeat(GROUP - 1) + ZWNJ;
/** Total invisible chars one marker adds to a string (a multiple of 9). */
export const MARKER_LENGTH = PAYLOAD_CHARS + GROUP;
/** Largest index the registry may encode (40 bits). */
export const MAX_MARKER_INDEX = 2 ** 40 - 1;

/** Present in the module so `npm run check:no-translator` can find this codec in a build. */
const CODEC_TAG = '__MM_TRANSLATOR_CODEC__';

/** Encodes `index` (0..MAX_MARKER_INDEX) as one marker. */
export function encodeIndex(index: number): string {
  if (!Number.isInteger(index) || index < 0 || index > MAX_MARKER_INDEX) {
    throw new RangeError(`${CODEC_TAG}: marker index out of range: ${index}`);
  }
  let out = '';
  for (let g = GROUPS - 1; g >= 0; g--) {
    // Division, not bit shifts: 40 bits exceed int32.
    const chunk = Math.floor(index / 2 ** (g * DATA_BITS)) % 2 ** DATA_BITS;
    out += ZWNJ;
    for (let bit = DATA_BITS - 1; bit >= 0; bit--) out += (chunk >> bit) & 1 ? ZWJ : ZWNJ;
    out += ZWNJ;
  }
  return out + TERMINATOR;
}

/** Index from the 54-char payload starting at `at`, or -1 if it is not well framed. */
function decodePayload(text: string, at: number): number {
  if (at < 0) return -1;
  let index = 0;
  for (let g = 0; g < GROUPS; g++) {
    const base = at + g * GROUP;
    if (text[base] !== ZWNJ || text[base + GROUP - 1] !== ZWNJ) return -1;
    let chunk = 0;
    for (let bit = 1; bit <= DATA_BITS; bit++) {
      const ch = text[base + bit];
      if (ch === ZWJ) chunk = chunk * 2 + 1;
      else if (ch === ZWNJ) chunk *= 2;
      else return -1;
    }
    index = index * 2 ** DATA_BITS + chunk;
  }
  return index;
}

/** Decodes exactly one marker (63 chars) back to its index, or `null`. */
export function decodeIndex(marker: string): number | null {
  if (marker.length !== MARKER_LENGTH || !marker.endsWith(TERMINATOR)) return null;
  const index = decodePayload(marker, 0);
  return index < 0 || index > MAX_MARKER_INDEX ? null : index;
}

export interface FoundMarker {
  index: number;
  /** Offset of the marker's first char in the searched string. */
  start: number;
  /** Offset just past the terminator. */
  end: number;
}

/** Every marker in `text`, left to right. */
export function findMarkers(text: string): FoundMarker[] {
  const found: FoundMarker[] = [];
  if (!text || text.length < MARKER_LENGTH) return found;
  let from = 0;
  for (;;) {
    const t = text.indexOf(TERMINATOR, from);
    if (t < 0) break;
    from = t + 1;
    // The terminator's eight U+200D must be preceded by the payload's closing U+200C.
    const start = t - PAYLOAD_CHARS;
    const index = decodePayload(text, start);
    if (index < 0 || index > MAX_MARKER_INDEX) continue;
    found.push({ index, start, end: t + TERMINATOR.length });
    from = t + TERMINATOR.length;
  }
  return found;
}

/** True when `text` holds at least one marker. Cheap pre-check for the scanner. */
export function hasMarker(text: string | null | undefined): boolean {
  if (!text || text.length < MARKER_LENGTH || !text.includes(TERMINATOR)) return false;
  return findMarkers(text).length > 0;
}

/** `text` with every marker removed (genuine joiners in the text are kept). */
export function stripMarkers(text: string): string {
  if (!hasMarker(text)) return text;
  let out = '';
  let cursor = 0;
  for (const { start, end } of findMarkers(text)) {
    out += text.slice(cursor, start);
    cursor = end;
  }
  return out + text.slice(cursor);
}

/**
 * Appends the marker for `index` to `text` after removing any markers already
 * inside it (an interpolated value that was itself translated): one string,
 * one marker, always at the end (ticket decision 3, nesting).
 */
export function appendMarker(text: string, index: number): string {
  return stripMarkers(text) + encodeIndex(index);
}
