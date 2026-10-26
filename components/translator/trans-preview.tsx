'use client';

import * as React from 'react';
import { declaredTags, parseTransTemplate, type TransNode } from '@/lib/translator/transTemplate';

export interface TransPreviewProps {
  template: string;
  source: string;
  /** Text direction of the target language. */
  dir: 'ltr' | 'rtl';
  className?: string;
}

const SAFE_INLINE = new Set([
  'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'code', 'small', 'sub', 'sup', 'mark',
]);

function renderNodes(nodes: TransNode[]): React.ReactNode[] {
  return nodes.map((node, i) => {
    if (node.type === 'text') return node.text;
    const { name } = node;
    if (name === 'br') return <br key={i} />;
    const children = node.selfClosing ? undefined : renderNodes(node.children);
    if (SAFE_INLINE.has(name)) return React.createElement(name, { key: i }, children);
    return (
      <span key={i} data-tag={name} className="underline decoration-dotted">
        {children}
      </span>
    );
  });
}

export function TransPreview({ template, source, dir, className }: TransPreviewProps) {
  const result = React.useMemo(
    () => parseTransTemplate(template, declaredTags(source)),
    [template, source],
  );

  return (
    <div className={className}>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Preview</div>
      {result.ok ? (
        <div data-testid="trans-preview" dir={dir} className="rounded-md border border-border bg-muted px-2 py-1 text-sm">
          {renderNodes(result.nodes)}
        </div>
      ) : (
        <p role="alert" className="text-xs text-destructive">
          Template cannot be previewed: {result.error}
        </p>
      )}
    </div>
  );
}
