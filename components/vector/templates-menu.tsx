'use client';

/**
 * MM110: the Templates menu in Motion's top bar (ticket decision 2). Every user gets the same
 * six ready-made animations Medi's `template` op runs (`lib/vector/templates.ts`), each as ONE
 * undo step labelled with the template's name. Placeholder text is localized; the user edits it
 * afterwards like any text layer. Logo reveal acts on the selection (or every layer when
 * nothing is selected).
 */
import * as React from 'react';
import { LayoutTemplate } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLocalization } from '@/i18n/useLocalization';
import { applyTemplate, TEMPLATE_DEFAULTS, TEMPLATE_KINDS, type TemplateKind, type TemplateOptions } from '@/lib/vector/templates';
import { useVectorStore } from '@/lib/vector/vectorStore';

type Translate = (key: string, vars?: Record<string, unknown>) => string;

/** The menu's options for one template: localized placeholder text, starting at the playhead. */
export function templateMenuOptions(kind: TemplateKind, t: Translate, time: number, selection: string[]): TemplateOptions {
  const at = Math.max(0, Math.round(time));
  switch (kind) {
    case 'lowerThird':
      return { at, text: [t('vector.templates.placeholder.name'), t('vector.templates.placeholder.role')] };
    case 'titlePop':
      return { at, text: t('vector.templates.placeholder.title') };
    case 'bulletReveal':
      return { at, text: [1, 2, 3].map((n) => t('vector.templates.placeholder.bullet', { n })) };
    case 'counter':
      return { at, value: TEMPLATE_DEFAULTS.counter.value };
    case 'badgeBounce':
      return { at, text: t('vector.templates.placeholder.badge') };
    case 'logoReveal':
      return { at, ...(selection.length ? { layerIds: selection } : {}) };
  }
}

/** Run a template from the menu as one undo step. Returns whether the document changed. */
export function runMenuTemplate(kind: TemplateKind, t: Translate, store = useVectorStore): boolean {
  const s = store.getState();
  if (!s.doc) return false;
  const r = applyTemplate(s.doc, kind, templateMenuOptions(kind, t, s.time, s.selection));
  if (!r.ok) {
    toast.error(t(`vector.templates.failed.${kind === 'logoReveal' ? 'logo' : 'generic'}`));
    return false;
  }
  s.mutate(`Template|${kind}`, () => r.doc, r.added.length ? r.added : undefined);
  return true;
}

export function TemplatesMenu({ disabled, onUsed }: { disabled?: boolean; onUsed?: (kind: TemplateKind) => void }) {
  const { t } = useLocalization('interface');
  const tr = t as unknown as Translate;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} data-testid="vector-templates-button" aria-label={t('vector.templates.button')}>
          <LayoutTemplate />
          <span className="hidden md:inline">{t('vector.templates.button')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>{t('vector.templates.title')}</DropdownMenuLabel>
        {TEMPLATE_KINDS.map((kind) => (
          <DropdownMenuItem
            key={kind}
            data-testid={`vector-template-${kind}`}
            className="flex flex-col items-start gap-0.5"
            onSelect={() => {
              if (runMenuTemplate(kind, tr)) onUsed?.(kind);
            }}
          >
            <span className="text-sm font-medium">{t(`vector.templates.${kind}`)}</span>
            <span className="text-xs text-muted-foreground">{t(`vector.templates.hint.${kind}`)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
