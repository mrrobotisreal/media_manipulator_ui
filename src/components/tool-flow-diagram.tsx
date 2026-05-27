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
      className={`bg-card border border-border rounded-lg p-6 my-8 ${className ?? ''}`}
      aria-label={resolvedTitle}
    >
      <h2 className="text-xl font-semibold text-card-foreground mb-4">{resolvedTitle}</h2>
      <ol className="flex flex-col md:flex-row md:flex-wrap md:items-stretch gap-3 list-none">
        {steps.map((step, index) => (
          <React.Fragment key={`${index}-${step.title}`}>
            <li className="flex md:flex-col md:flex-1 md:min-w-[180px] gap-3 md:items-start md:gap-2 rounded-md border border-border bg-background/40 p-3">
              <span
                aria-hidden="true"
                className="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-semibold flex items-center justify-center text-sm"
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
