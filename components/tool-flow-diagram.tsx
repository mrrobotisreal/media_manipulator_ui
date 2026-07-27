'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';

export interface ToolFlowStep {
  title: string;
  description?: string;
}

interface ToolFlowDiagramProps {
  title?: string;
  steps: ToolFlowStep[];
  className?: string;
}

/**
 * Lightweight, accessible flow diagram for /tools landing pages.
 * Renders an ordered list of steps with arrow separators using only
 * CSS — no chart library. Stacks vertically on small screens and
 * lays out horizontally with arrows on larger viewports.
 */
const ToolFlowDiagram: React.FC<ToolFlowDiagramProps> = ({
  title,
  steps,
  className,
}) => {
  const { t } = useLocalization('interface');
  if (steps.length === 0) return null;
  const resolvedTitle = title ?? t('toolFlowDiagram.defaultTitle');

  return (
    <section
      className={`my-8 rounded-lg border border-edge bg-surface-1 p-4 shadow-[inset_0_1px_0_var(--edge-highlight)] sm:p-6 ${className ?? ''}`}
      aria-label={resolvedTitle}
    >
      <h2 className="text-xl font-semibold text-card-foreground mb-4">{resolvedTitle}</h2>
      <ol className="flex flex-col md:flex-row md:flex-wrap md:items-stretch gap-3 list-none">
        {steps.map((step, index) => (
          <React.Fragment key={`${index}-${step.title}`}>
            <li className="flex md:flex-col md:flex-1 md:min-w-[180px] gap-3 md:items-start md:gap-2 rounded-md border border-edge bg-surface-2/40 p-3">
              <span
                aria-hidden="true"
                className="num grid size-8 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 text-xs text-primary"
              >
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-card-foreground">{step.title}</p>
                {step.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
            {index < steps.length - 1 && (
              <li
                aria-hidden="true"
                className="hidden md:flex items-center justify-center text-muted-foreground"
              >
                <ArrowRight className="w-5 h-5" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </section>
  );
};

export default ToolFlowDiagram;
