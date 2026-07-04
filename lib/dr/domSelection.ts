// DOM → text-anchor math. Converts a browser Selection Range into a DrTextAnchor
// whose start/end are offsets into the block's blockPlainText. It MUST agree
// with schemas/drComments.ts:
//   - the block wrapper carries data-block-index, each unit carries
//     data-unit-index (list item / table cell / blockquote line / the single
//     text unit of a paragraph/heading/callout/code);
//   - the local offset within a unit is Range.toString().length up to the
//     boundary — which equals the unit's plain-text prefix length because a
//     unit container's textContent is exactly its concatenated span text;
//   - unitStartOffset() adds one '\n' per preceding unit, matching the '\n'
//     joins in blockPlainText. The '\n' separators are never in the DOM.

import type { DrDocContent } from '@/schemas/drDocs';
import { blockPlainText, blockUnitTexts, unitStartOffset, type DrTextAnchor } from '@/schemas/drComments';

function elementOf(node: Node): HTMLElement | null {
  return node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement);
}

function blockWrapperOf(node: Node, articleEl: HTMLElement): HTMLElement | null {
  const el = elementOf(node);
  if (!el || !articleEl.contains(el)) return null;
  const wrap = el.closest('[data-block-index]');
  return wrap && articleEl.contains(wrap) ? (wrap as HTMLElement) : null;
}

function unitOf(node: Node, blockWrap: HTMLElement): HTMLElement | null {
  const el = elementOf(node);
  if (!el || !blockWrap.contains(el)) return null;
  const unit = el.closest('[data-unit-index]');
  return unit && blockWrap.contains(unit) ? (unit as HTMLElement) : null;
}

function localOffset(unitEl: HTMLElement, node: Node, offset: number): number {
  const r = document.createRange();
  r.selectNodeContents(unitEl);
  try {
    r.setEnd(node, offset);
  } catch {
    return unitEl.textContent?.length ?? 0;
  }
  return r.toString().length;
}

function blockOffset(units: string[], blockWrap: HTMLElement, node: Node, offset: number): number | null {
  const unitEl = unitOf(node, blockWrap);
  if (!unitEl) return null;
  const unitIndex = Number(unitEl.getAttribute('data-unit-index'));
  if (Number.isNaN(unitIndex)) return null;
  return unitStartOffset(units, unitIndex) + localOffset(unitEl, node, offset);
}

/**
 * Compute a single-block text anchor from a selection range, or null when the
 * selection is collapsed, crosses block boundaries (the v1 single-block rule),
 * or can't be mapped.
 */
export function computeTextAnchor(content: DrDocContent, articleEl: HTMLElement, range: Range): DrTextAnchor | null {
  if (range.collapsed) return null;

  const startWrap = blockWrapperOf(range.startContainer, articleEl);
  const endWrap = blockWrapperOf(range.endContainer, articleEl);
  if (!startWrap || !endWrap || startWrap !== endWrap) return null; // single-block only

  const blockIndex = Number(startWrap.getAttribute('data-block-index'));
  if (Number.isNaN(blockIndex)) return null;
  const block = content.blocks[blockIndex];
  if (!block) return null;

  const units = blockUnitTexts(block);
  const a = blockOffset(units, startWrap, range.startContainer, range.startOffset);
  const b = blockOffset(units, startWrap, range.endContainer, range.endOffset);
  if (a === null || b === null) return null;

  const start = Math.min(a, b);
  const end = Math.max(a, b);
  if (end <= start) return null;

  const quote = blockPlainText(block).slice(start, end);
  return { type: 'text', blockIndex, start, end, quote };
}
