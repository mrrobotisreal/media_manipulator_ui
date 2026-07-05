'use client';

import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// Callout node view — mirrors the renderer's callout treatment. The icon button
// toggles the variant (info ↔ warning); the text is real inline editor content
// (NodeViewContent).
export default function CalloutNodeView({ node, updateAttributes }: NodeViewProps) {
  const isWarning = node.attrs.variant === 'warning';
  const Icon = isWarning ? AlertTriangle : Info;
  return (
    <NodeViewWrapper
      className={cn(
        'my-5 flex gap-3 rounded-lg border p-4',
        isWarning ? 'border-amber-500/40 bg-amber-500/10' : 'border-primary/40 bg-primary/10',
      )}
      data-variant={isWarning ? 'warning' : 'info'}
    >
      <button
        type="button"
        contentEditable={false}
        onClick={() => updateAttributes({ variant: isWarning ? 'info' : 'warning' })}
        title="Toggle info / warning"
        className={cn('mt-0.5 shrink-0 transition-colors', isWarning ? 'text-amber-500' : 'text-primary')}
      >
        <Icon className="size-5" />
      </button>
      <NodeViewContent className="flex-1 leading-7 text-foreground/90" />
    </NodeViewWrapper>
  );
}
