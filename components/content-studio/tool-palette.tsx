'use client';

import React from 'react';
import { MousePointer2, Slice, MoveHorizontal, ArrowLeftRight, Hand } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore, type StudioToolMode } from '@/lib/studioStore';
import { KEYMAP, formatBinding, type CommandId } from '@/lib/studio/keymap';
import { runCommand } from '@/lib/studio/commands';

const TOOLS: { mode: StudioToolMode; command: CommandId; icon: React.ElementType; labelKey: string }[] = [
  { mode: 'select', command: 'tool.select', icon: MousePointer2, labelKey: 'toolSelect' },
  { mode: 'razor', command: 'tool.razor', icon: Slice, labelKey: 'toolRazor' },
  { mode: 'slip', command: 'tool.slip', icon: MoveHorizontal, labelKey: 'toolSlip' },
  { mode: 'slide', command: 'tool.slide', icon: ArrowLeftRight, labelKey: 'toolSlide' },
  { mode: 'hand', command: 'tool.hand', icon: Hand, labelKey: 'toolHand' },
];

/** The key shown in a tool's tooltip comes from the keymap table, never a literal. */
function keyFor(command: CommandId): string {
  const b = KEYMAP.find((k) => k.command === command);
  return b ? formatBinding(b) : '';
}

/**
 * Slim vertical tool palette on the timeline's left edge (part 18). Pressing a
 * button routes through the same `runCommand` as the keyboard shortcut, tagged
 * 'ui' for the shortcut-vs-UI attribution counters.
 */
const ToolPalette: React.FC = () => {
  const { t } = useLocalization('interface');
  const toolMode = useStudioStore((s) => s.toolMode);
  return (
    <TooltipProvider delayDuration={200}>
      <div
        role="toolbar"
        aria-orientation="vertical"
        aria-label={t('contentStudio.timeline.tools')}
        className="flex w-9 shrink-0 flex-col items-center gap-1 border-r border-border bg-surface-0/40 py-1.5"
      >
        {TOOLS.map(({ mode, command, icon: Icon, labelKey }) => {
          const active = toolMode === mode;
          const label = t(`contentStudio.timeline.${labelKey}`);
          return (
            <Tooltip key={mode}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={label}
                  aria-pressed={active}
                  data-tool={mode}
                  onClick={() => runCommand(command, 'ui')}
                  className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                    active
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {label} <kbd className="ml-1 rounded bg-background/20 px-1 font-mono text-[10px]">{keyFor(command)}</kbd>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default ToolPalette;
