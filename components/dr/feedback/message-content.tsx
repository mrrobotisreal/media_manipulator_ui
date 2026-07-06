'use client';

import type { DrMessageBlock, DrMessageContent } from '@/schemas/drFeedback';
import { renderSpans } from '../dr-spans';

// Renders a message's dr-blocks/v1 restricted content (paragraph / blockquote /
// list / code) with chat-appropriate compact styling. Inline spans (bold /
// italic / code / link) go through the SHARED span renderer (dr-spans.tsx), so a
// link or inline code looks identical to the same thing in a document.

function MessageBlock({ block }: { block: DrMessageBlock }) {
  switch (block.type) {
    case 'paragraph':
      // Empty paragraphs are dropped at serialize time, but guard anyway so an
      // empty <p> never adds phantom spacing.
      if (block.spans.length === 0) return null;
      return <p className="leading-relaxed">{renderSpans(block.spans)}</p>;

    case 'blockquote':
      return (
        <blockquote className="border-l-2 border-primary/40 pl-3 text-foreground/80">
          {block.lines.map((line, i) =>
            line.length === 0 ? (
              <div key={i} className="h-2.5" aria-hidden />
            ) : (
              <p key={i} className="leading-relaxed">
                {renderSpans(line)}
              </p>
            ),
          )}
        </blockquote>
      );

    case 'list':
      return block.ordered ? (
        <ol className="ml-5 list-decimal space-y-0.5">
          {block.items.map((item, i) => (
            <li key={i}>{renderSpans(item)}</li>
          ))}
        </ol>
      ) : (
        <ul className="ml-5 list-disc space-y-0.5">
          {block.items.map((item, i) => (
            <li key={i}>{renderSpans(item)}</li>
          ))}
        </ul>
      );

    case 'code':
      return (
        <pre className="relative overflow-x-auto rounded-md border border-border bg-muted/40 p-3">
          {block.language && (
            <span className="absolute right-2 top-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {block.language}
            </span>
          )}
          <code className="font-mono text-xs leading-tight whitespace-pre">{block.code}</code>
        </pre>
      );

    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

export default function MessageContent({ content }: { content: DrMessageContent }) {
  if (content.blocks.length === 0) return null;
  return (
    <div className="space-y-1.5 text-sm text-foreground/90">
      {content.blocks.map((block, i) => (
        <MessageBlock key={i} block={block} />
      ))}
    </div>
  );
}
