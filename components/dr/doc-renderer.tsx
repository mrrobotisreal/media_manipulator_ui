'use client';

import { Fragment, useEffect } from 'react';
import { AlertTriangle, Download, File as FileIcon, Info, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import type { DrBlock, DrDocContent, DrSpan } from '@/schemas/drDocs';
import {
  blockUnitTexts,
  isTextAnchorLive,
  unitStartOffset,
  type DrComment,
  type DrCommentAnchor,
} from '@/schemas/drComments';
import { highlightUnitSpans, type HighlightPiece, type HighlightRange } from '@/lib/dr/highlights';
import { decorate, scrollToAnchor } from './dr-spans';

// The id used for the in-progress draft's temporary highlight.
export const PENDING_HIGHLIGHT_ID = '__pending__';

interface DrDocRendererProps {
  content: DrDocContent;
  // Comment overlays (optional so the renderer still works without comments).
  comments?: DrComment[];
  pendingAnchor?: DrCommentAnchor | null;
  activeCommentId?: string | null;
  onActivateComment?: (id: string) => void;
  // Right-click on a media block → block-anchor comment target.
  onBlockContextMenu?: (blockIndex: number, rect: DOMRect) => void;
}

// Human-readable byte size for file blocks (e.g. "3.2 MB", "812 KB").
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

interface RenderCtx {
  activeCommentId: string | null;
  onActivateComment?: (id: string) => void;
}

function markClass(idCount: number, active: boolean, pending: boolean): string {
  if (pending) return 'rounded-sm bg-yellow-200/80 dark:bg-yellow-500/40';
  const layered = idCount > 1 ? 'bg-yellow-300/80 dark:bg-yellow-500/45' : 'bg-yellow-200/70 dark:bg-yellow-500/30';
  return cn(
    'rounded-sm cursor-pointer transition-colors',
    layered,
    active && 'bg-yellow-400/90 dark:bg-yellow-400/50 ring-1 ring-yellow-500',
  );
}

function nextActiveId(ids: string[], active: string | null): string {
  if (!active) return ids[0];
  const idx = ids.indexOf(active);
  return idx === -1 ? ids[0] : ids[(idx + 1) % ids.length];
}

// Render one unit's highlight pieces (no surrounding whitespace — the unit
// container's textContent must equal its plain text for offset agreement).
function renderPieces(pieces: HighlightPiece[], ctx: RenderCtx): React.ReactNode {
  return pieces.map((piece, i) => {
    let node: React.ReactNode = decorate(piece.text, piece);
    if (piece.ids.length > 0) {
      const pending = piece.ids.includes(PENDING_HIGHLIGHT_ID);
      const realIds = piece.ids.filter((id) => id !== PENDING_HIGHLIGHT_ID);
      const active = !!ctx.activeCommentId && realIds.includes(ctx.activeCommentId);
      node = (
        <mark
          data-comment-ids={piece.ids.join(' ')}
          className={markClass(realIds.length, active, pending && realIds.length === 0)}
          onClick={
            realIds.length
              ? (e) => {
                  e.stopPropagation();
                  ctx.onActivateComment?.(nextActiveId(realIds, ctx.activeCommentId));
                }
              : undefined
          }
        >
          {node}
        </mark>
      );
    }
    return <Fragment key={i}>{node}</Fragment>;
  });
}

// Collect the highlight ranges (in block-plain-text coords) for one block from
// live text-anchored comments plus the pending draft.
function rangesForBlock(
  block: DrBlock,
  blockIndex: number,
  comments: DrComment[],
  pendingAnchor: DrCommentAnchor | null,
): HighlightRange[] {
  const ranges: HighlightRange[] = [];
  for (const c of comments) {
    if (c.anchor.type === 'text' && c.anchor.blockIndex === blockIndex && isTextAnchorLive(block, c.anchor)) {
      ranges.push({ start: c.anchor.start, end: c.anchor.end, id: c.id });
    }
  }
  if (pendingAnchor && pendingAnchor.type === 'text' && pendingAnchor.blockIndex === blockIndex) {
    ranges.push({ start: pendingAnchor.start, end: pendingAnchor.end, id: PENDING_HIGHLIGHT_ID });
  }
  return ranges;
}

// Render one text unit's content given its spans and base offset.
function unitContent(spans: DrSpan[], unitBase: number, ranges: HighlightRange[], ctx: RenderCtx): React.ReactNode {
  return renderPieces(highlightUnitSpans(spans, unitBase, ranges), ctx);
}

function BlockView({
  block,
  index,
  comments,
  pendingAnchor,
  ctx,
  onBlockContextMenu,
}: {
  block: DrBlock;
  index: number;
  comments: DrComment[];
  pendingAnchor: DrCommentAnchor | null;
  ctx: RenderCtx;
  onBlockContextMenu?: (blockIndex: number, rect: DOMRect) => void;
}): React.ReactNode {
  const ranges = rangesForBlock(block, index, comments, pendingAnchor);
  const units = blockUnitTexts(block);

  switch (block.type) {
    case 'heading': {
      const base = 'scroll-mt-24 font-semibold tracking-tight text-foreground';
      const inner = unitContent([{ text: block.text }], 0, ranges, ctx);
      if (block.level === 1)
        return (
          <h2 id={block.id} data-unit-index={0} className={cn(base, 'mt-10 mb-4 border-b border-border pb-2 text-2xl')}>
            {inner}
          </h2>
        );
      if (block.level === 2)
        return (
          <h3 id={block.id} data-unit-index={0} className={cn(base, 'mt-8 mb-3 text-xl')}>
            {inner}
          </h3>
        );
      return (
        <h4 id={block.id} data-unit-index={0} className={cn(base, 'mt-6 mb-2 text-lg')}>
          {inner}
        </h4>
      );
    }

    case 'paragraph':
      return (
        <p data-unit-index={0} className="my-4 leading-7 text-foreground/90">
          {unitContent(block.spans, 0, ranges, ctx)}
        </p>
      );

    case 'callout': {
      const isWarning = block.variant === 'warning';
      const Icon = isWarning ? AlertTriangle : Info;
      return (
        <div
          className={cn(
            'my-5 flex gap-3 rounded-lg border p-4',
            isWarning ? 'border-amber-500/40 bg-amber-500/10' : 'border-primary/40 bg-primary/10',
          )}
        >
          <Icon className={cn('mt-0.5 size-5 shrink-0', isWarning ? 'text-amber-500' : 'text-primary')} />
          <div data-unit-index={0} className="leading-7 text-foreground/90">
            {unitContent(block.spans, 0, ranges, ctx)}
          </div>
        </div>
      );
    }

    case 'blockquote':
      return (
        <blockquote className="my-5 border-l-2 border-primary/40 pl-4 text-foreground/80">
          {block.lines.map((line, i) =>
            line.length === 0 ? (
              <div key={i} data-unit-index={i} className="h-3" aria-hidden />
            ) : (
              <p key={i} data-unit-index={i} className="leading-7">
                {unitContent(line, unitStartOffset(units, i), ranges, ctx)}
              </p>
            ),
          )}
        </blockquote>
      );

    case 'list': {
      const items = block.items.map((item, i) => (
        <li key={i} data-unit-index={i} className="leading-7">
          {unitContent(item, unitStartOffset(units, i), ranges, ctx)}
        </li>
      ));
      return block.ordered ? (
        <ol className="my-4 ml-6 list-decimal space-y-1.5 text-foreground/90">{items}</ol>
      ) : (
        <ul className="my-4 ml-6 list-disc space-y-1.5 text-foreground/90">{items}</ul>
      );
    }

    case 'table': {
      const headerCells = block.headerRow && block.rows[0] ? block.rows[0] : null;
      const bodyRows = block.headerRow ? block.rows.slice(1) : block.rows;
      // Flat row-major index of each row's first cell (matches blockUnitTexts,
      // header row first). Computed without mutating a render variable.
      const rowStart = block.rows.reduce<number[]>(
        (acc, _row, i) => [...acc, i === 0 ? 0 : acc[i - 1] + block.rows[i - 1].length],
        [],
      );
      const bodyRowStart = block.headerRow ? rowStart.slice(1) : rowStart;
      return (
        <div className="my-5 overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            {headerCells && (
              <thead className="bg-muted/50">
                <tr>
                  {headerCells.map((cell, ci) => (
                    <th
                      key={ci}
                      data-unit-index={ci}
                      className="border-b border-border px-3 py-2 text-left font-semibold text-foreground"
                    >
                      {unitContent(cell, unitStartOffset(units, ci), ranges, ctx)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} className="odd:bg-muted/20">
                  {row.map((cell, ci) => {
                    const idxForCell = bodyRowStart[ri] + ci;
                    return (
                      <td
                        key={ci}
                        data-unit-index={idxForCell}
                        className="border-b border-border/60 px-3 py-2 align-top text-foreground/90"
                      >
                        {unitContent(cell, unitStartOffset(units, idxForCell), ranges, ctx)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'code':
      return (
        <pre className="my-5 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4">
          <code data-unit-index={0} className="font-mono text-xs leading-tight whitespace-pre">
            {unitContent([{ text: block.code }], 0, ranges, ctx)}
          </code>
        </pre>
      );

    case 'divider':
      return <Separator className="my-8" />;

    case 'image':
    case 'video':
    case 'file': {
      const blockComments = comments.filter((c) => c.anchor.type === 'block' && c.anchor.blockIndex === index);
      const hasComments = blockComments.length > 0;
      const active = !!ctx.activeCommentId && blockComments.some((c) => c.id === ctx.activeCommentId);
      const mediaClass = cn(
        'max-w-full rounded-lg border',
        hasComments ? 'ring-2 ring-yellow-400' : 'border-border',
        active && 'ring-yellow-500',
      );
      return (
        <figure
          className={cn('relative my-6', block.type === 'file' ? 'max-w-md' : 'w-fit')}
          onContextMenu={(e) => {
            if (!onBlockContextMenu) return;
            e.preventDefault();
            onBlockContextMenu(index, (e.currentTarget as HTMLElement).getBoundingClientRect());
          }}
        >
          {block.type === 'image' && <img src={block.src} alt={block.alt} className={mediaClass} />}
          {block.type === 'video' && <video src={block.src} controls className={mediaClass} />}
          {block.type === 'file' && (
            // File blocks are downloadable attachments. The API sets
            // Content-Disposition: attachment on the presigned src so the
            // original filename is preserved regardless of the `download` attr.
            <a
              href={block.src}
              target="_blank"
              rel="noopener noreferrer"
              download
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 no-underline transition-colors hover:bg-accent/40',
                hasComments ? 'ring-2 ring-yellow-400' : 'border-border',
                active && 'ring-yellow-500',
              )}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <FileIcon className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{block.name}</p>
                {block.sizeBytes != null && (
                  <p className="text-xs text-muted-foreground">{formatBytes(block.sizeBytes)}</p>
                )}
              </div>
              <Download className="size-4 shrink-0 text-muted-foreground" />
            </a>
          )}
          {hasComments && (
            <button
              type="button"
              onClick={() => ctx.onActivateComment?.(blockComments[0].id)}
              className="absolute -right-2 -top-2 flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-medium text-yellow-950 shadow"
              aria-label={`${blockComments.length} comments`}
            >
              <MessageSquare className="size-3" />
              {blockComments.length}
            </button>
          )}
          {block.type !== 'file' && block.caption && (
            <figcaption data-unit-index={0} className="mt-2 text-center text-sm text-muted-foreground">
              {unitContent([{ text: block.caption }], 0, ranges, ctx)}
            </figcaption>
          )}
        </figure>
      );
    }

    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

export default function DrDocRenderer({
  content,
  comments = [],
  pendingAnchor = null,
  activeCommentId = null,
  onActivateComment,
  onBlockContextMenu,
}: DrDocRendererProps) {
  // Honour a #hash in the URL on initial load (shared deep link to a section).
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.length <= 1) return;
    const id = decodeURIComponent(hash.slice(1));
    const raf = requestAnimationFrame(() => scrollToAnchor(id, false));
    return () => cancelAnimationFrame(raf);
  }, []);

  const ctx: RenderCtx = { activeCommentId, onActivateComment };

  return (
    <div className="dr-doc">
      {content.blocks.map((block, i) => (
        <div key={i} data-block-index={i}>
          <BlockView
            block={block}
            index={i}
            comments={comments}
            pendingAnchor={pendingAnchor}
            ctx={ctx}
            onBlockContextMenu={onBlockContextMenu}
          />
        </div>
      ))}
    </div>
  );
}
