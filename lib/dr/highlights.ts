import type { DrSpan } from '@/schemas/drDocs';

// Pure highlight span-splitting — shared by the renderer for every text-bearing
// block type (paragraph, list item, table cell, blockquote line, heading, code)
// so overlap handling is identical everywhere. Given a unit's spans and a set of
// highlight ranges (in the block's plain-text coordinates), it splits the spans
// at all range boundaries and tags each resulting piece with the comment ids
// covering it. Overlapping comments therefore share a piece (multiple ids → the
// renderer deepens the tint), and every comment remains reachable.

/** A highlight range in block-plain-text coordinates. id '__pending__' marks the
 *  in-progress draft selection. */
export interface HighlightRange {
  start: number;
  end: number;
  id: string;
}

/** One rendered slice of a unit: text + inherited emphasis + covering ids. */
export interface HighlightPiece {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  link?: string;
  ids: string[];
}

function dedupe(ids: string[]): string[] {
  return [...new Set(ids)];
}

/**
 * Split a unit's spans into highlight pieces.
 * @param spans      the unit's spans (a plain-text unit like a heading/code is passed as a single span)
 * @param unitBase   the unit's start offset within blockPlainText
 * @param ranges     highlight ranges in blockPlainText coordinates
 */
export function highlightUnitSpans(spans: DrSpan[], unitBase: number, ranges: HighlightRange[]): HighlightPiece[] {
  const unitLen = spans.reduce((n, s) => n + s.text.length, 0);

  // Localize ranges to [0, unitLen) and drop empties.
  const local = ranges
    .map((r) => ({ start: Math.max(0, r.start - unitBase), end: Math.min(unitLen, r.end - unitBase), id: r.id }))
    .filter((r) => r.end > r.start);

  if (local.length === 0) {
    // No highlights in this unit — return spans unchanged (one piece each).
    return spans
      .filter((s) => s.text.length > 0)
      .map((s) => ({ text: s.text, bold: s.bold, italic: s.italic, code: s.code, link: s.link, ids: [] }));
  }

  const boundaries = new Set<number>([0, unitLen]);
  for (const r of local) {
    boundaries.add(r.start);
    boundaries.add(r.end);
  }
  const sorted = [...boundaries].filter((b) => b >= 0 && b <= unitLen).sort((a, b) => a - b);

  const pieces: HighlightPiece[] = [];
  let spanStart = 0;
  for (const span of spans) {
    const sStart = spanStart;
    const sEnd = spanStart + span.text.length;
    spanStart = sEnd;
    if (span.text.length === 0) continue;

    // Boundary offsets strictly inside this span, plus the span end.
    const points = sorted.filter((b) => b > sStart && b < sEnd);
    points.push(sEnd);

    let cursor = sStart;
    for (const p of points) {
      if (p <= cursor) continue;
      const text = span.text.slice(cursor - sStart, p - sStart);
      const ids = local.filter((r) => r.start <= cursor && r.end >= p).map((r) => r.id);
      pieces.push({ text, bold: span.bold, italic: span.italic, code: span.code, link: span.link, ids: dedupe(ids) });
      cursor = p;
    }
  }
  return pieces;
}
