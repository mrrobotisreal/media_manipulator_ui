'use client';

import { Fragment } from 'react';
import type { DrSpan } from '@/schemas/drDocs';

// Shared inline span rendering for the Double Raven portal. Extracted verbatim
// from doc-renderer.tsx so BOTH the document renderer and the feedback message
// renderer emit byte-identical inline markup (text + bold/italic/inline-code +
// in-page-anchor / external links). No dangerouslySetInnerHTML — everything is
// real React nodes.

// Smooth-scroll to an in-page section and reflect it in the URL without a jump.
export function scrollToAnchor(id: string, updateHash: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (updateHash) history.replaceState(null, '', `#${id}`);
}

// Apply a span's inline emphasis + link to a node.
export function decorate(node: React.ReactNode, span: Pick<DrSpan, 'bold' | 'italic' | 'code' | 'link'>): React.ReactNode {
  let out = node;
  if (span.code) out = <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">{out}</code>;
  if (span.bold) out = <strong className="font-semibold text-foreground">{out}</strong>;
  if (span.italic) out = <em>{out}</em>;
  if (span.link) {
    if (span.link.startsWith('#')) {
      // In-page anchor (e.g. a Table of Contents entry): smooth-scroll, no new
      // tab, and a distinct accent from body/external links — blue at rest,
      // purple on hover with a gentle scale + soft purple glow. The transition
      // sits on the BASE class (not only hover:) so scale-down and glow-fade are
      // equally smooth in both directions; the rest-state transparent text-shadow
      // gives the browser a start value so the glow animates rather than popping.
      // scale() requires inline-block; origin-left keeps the left edge planted in
      // the ordered list (text grows rightward). A dark drop-shadow was rejected —
      // it's invisible on the dark theme, so the purple glow is the accent.
      // Reduced-motion users get the colour change without the scale.
      const id = span.link.slice(1);
      out = (
        <a
          href={span.link}
          className="inline-block origin-left text-blue-400 underline underline-offset-2 transition-[color,transform,text-shadow] duration-200 ease-out [text-shadow:0_0_12px_transparent] hover:scale-[1.08] hover:text-violet-400 hover:[text-shadow:0_0_12px_rgba(167,139,250,0.55)] motion-reduce:transform-none motion-reduce:transition-none"
          onClick={(e) => {
            e.preventDefault();
            scrollToAnchor(id, true);
          }}
        >
          {out}
        </a>
      );
    } else {
      out = (
        <a
          href={span.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:no-underline"
        >
          {out}
        </a>
      );
    }
  }
  return out;
}

// Render a plain list of spans (no comment-highlight overlay) — used by the
// feedback message renderer. Adjacent spans are decorated independently and
// keyed by index.
export function renderSpans(spans: DrSpan[]): React.ReactNode {
  return spans.map((span, i) => <Fragment key={i}>{decorate(span.text, span)}</Fragment>);
}
