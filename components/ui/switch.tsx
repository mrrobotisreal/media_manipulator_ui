'use client';

import * as React from 'react';
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from '@/lib/utils';

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
        // Checked is green on purpose — the Darkroom green is --success. The
        // palette sweep briefly made this teal; green is the deliberate choice.
        'data-[state=checked]:border-success data-[state=checked]:bg-success',
        // When off, the track outline is the only affordance, so it needs a
        // perceivable boundary (3:1, WCAG 1.4.11) rather than surface-on-surface.
        'data-[state=unchecked]:border-control data-[state=unchecked]:bg-surface-2',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-surface-1 shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
