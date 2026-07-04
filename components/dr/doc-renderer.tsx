'use client';

import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import type { DrBlock, DrDocContent, DrSpan } from '@/schemas/drDocs';

// Pure presentational mapping of DrBlock[] → themed React. No
// dangerouslySetInnerHTML anywhere — every piece of content flows through typed
// blocks and spans. The block switch is exhaustive with a `never` check so
// adding a block type to the schema fails typecheck here until it is handled.

function Span({ span }: { span: DrSpan }) {
  let node: React.ReactNode = span.text;
  if (span.code) {
    node = <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">{node}</code>;
  }
  if (span.bold) node = <strong className="font-semibold text-foreground">{node}</strong>;
  if (span.italic) node = <em>{node}</em>;
  if (span.link) {
    node = (
      <a
        href={span.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:no-underline"
      >
        {node}
      </a>
    );
  }
  return <>{node}</>;
}

function Spans({ spans }: { spans: DrSpan[] }) {
  return (
    <>
      {spans.map((span, i) => (
        <Span key={i} span={span} />
      ))}
    </>
  );
}

function Block({ block }: { block: DrBlock }) {
  switch (block.type) {
    case 'heading': {
      const base = 'scroll-mt-24 font-semibold tracking-tight text-foreground';
      if (block.level === 1) {
        return (
          <h2 id={block.id} className={cn(base, 'mt-10 mb-4 border-b border-border pb-2 text-2xl')}>
            {block.text}
          </h2>
        );
      }
      if (block.level === 2) {
        return (
          <h3 id={block.id} className={cn(base, 'mt-8 mb-3 text-xl')}>
            {block.text}
          </h3>
        );
      }
      return (
        <h4 id={block.id} className={cn(base, 'mt-6 mb-2 text-lg')}>
          {block.text}
        </h4>
      );
    }

    case 'paragraph':
      return (
        <p className="my-4 leading-7 text-foreground/90">
          <Spans spans={block.spans} />
        </p>
      );

    case 'blockquote':
      return (
        <blockquote className="my-5 border-l-2 border-primary/40 pl-4 text-foreground/80">
          {block.lines.map((line, i) =>
            line.length === 0 ? (
              <div key={i} className="h-3" aria-hidden />
            ) : (
              <p key={i} className="leading-7">
                <Spans spans={line} />
              </p>
            ),
          )}
        </blockquote>
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
          <div className="leading-7 text-foreground/90">
            <Spans spans={block.spans} />
          </div>
        </div>
      );
    }

    case 'list': {
      const items = block.items.map((item, i) => (
        <li key={i} className="leading-7">
          <Spans spans={item} />
        </li>
      ));
      return block.ordered ? (
        <ol className="my-4 ml-6 list-decimal space-y-1.5 text-foreground/90">{items}</ol>
      ) : (
        <ul className="my-4 ml-6 list-disc space-y-1.5 text-foreground/90">{items}</ul>
      );
    }

    case 'table': {
      const bodyRows = block.headerRow ? block.rows.slice(1) : block.rows;
      return (
        <div className="my-5 overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            {block.headerRow && block.rows[0] && (
              <thead className="bg-muted/50">
                <tr>
                  {block.rows[0].map((cell, ci) => (
                    <th
                      key={ci}
                      className="border-b border-border px-3 py-2 text-left font-semibold text-foreground"
                    >
                      <Spans spans={cell} />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} className="odd:bg-muted/20">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border-b border-border/60 px-3 py-2 align-top text-foreground/90"
                    >
                      <Spans spans={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'code':
      // whitespace-pre + overflow-x-auto so the §9.3 ASCII architecture diagram
      // renders un-wrapped and un-mangled.
      return (
        <pre className="my-5 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4">
          <code className="font-mono text-xs leading-tight whitespace-pre">{block.code}</code>
        </pre>
      );

    case 'divider':
      return <Separator className="my-8" />;

    default: {
      // Exhaustiveness guard: if a new DrBlock variant is added to the schema
      // without a case here, this assignment fails to compile.
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

export default function DrDocRenderer({ content }: { content: DrDocContent }) {
  return (
    <div className="dr-doc">
      {content.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
