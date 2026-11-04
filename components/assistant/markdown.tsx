'use client';

/**
 * Medi's answer renderer (MM107; shared with the MM108+ copilots). GFM markdown with NO raw HTML
 * (react-markdown's default, no rehype-raw), like the DR chat lab's renderer, plus the Medi link
 * rule: only same-site links survive, re-prefixed with the visitor's locale and opened in the same
 * tab; anything else renders as plain text. Images in model text are never loaded.
 */
import { memo, type ReactNode } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { safeSiteHref } from '@/lib/assistant/links';
import { cn } from '@/lib/utils';

export interface AssistantMarkdownProps {
  content: string;
  /** BCP-47 code of the visitor's locale, for link prefixes. */
  locale: string;
  /** Told about every followed site link (analytics). */
  onLink?: (href: string) => void;
  className?: string;
}

function AssistantMarkdownInner({ content, locale, onLink, className }: AssistantMarkdownProps) {
  return (
    <div
      className={cn(
        'medi-md min-w-0 break-words text-sm leading-relaxed',
        '[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0',
        '[&_h1]:mt-3 [&_h1]:mb-1.5 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1.5 [&_h2]:font-semibold [&_h3]:mt-2 [&_h3]:font-semibold',
        '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:ps-5 [&_li]:my-0.5',
        '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
        '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-[13px] [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted/50 [&_pre]:p-2',
        '[&_table]:my-2 [&_table]:w-full [&_table]:text-xs [&_td]:border-b [&_td]:border-border/60 [&_td]:px-2 [&_td]:py-1 [&_th]:border-b [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:text-start',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const safe = safeSiteHref(href, locale);
            if (!safe) return <span>{children as ReactNode}</span>;
            return (
              <Link href={safe} prefetch={false} onClick={() => onLink?.(safe)}>
                {children as ReactNode}
              </Link>
            );
          },
          img: ({ alt }) => <span>{alt ?? ''}</span>,
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children as ReactNode}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/** Memoized: completed answers keep a stable tree while the next one streams. */
export const AssistantMarkdown = memo(AssistantMarkdownInner);
export default AssistantMarkdown;
