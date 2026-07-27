'use client';

import { Toaster as Sonner, type ToasterProps } from "sonner"

import { useTheme } from "@/components/theme-provider"

/**
 * B8 fix: this previously imported `useTheme` from a second theme library whose
 * provider was never mounted anywhere — so the hook returned its default and the
 * Toaster theme was permanently stuck. That dependency is now gone from
 * package.json entirely. It now reads the real provider
 * (components/theme-provider.tsx), whose `resolvedTheme` is already narrowed to
 * "dark" | "light", so "system" never leaks through to Sonner.
 *
 * Surfaces are Darkroom tokens: raised surface-2 with a hairline edge, coral for
 * errors, teal for info, green for success.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--surface-2)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--edge)",

          "--error-bg": "var(--surface-2)",
          "--error-text": "var(--accent-primary)",
          "--error-border": "var(--accent-primary)",

          "--success-bg": "var(--surface-2)",
          "--success-text": "var(--success)",
          "--success-border": "var(--success)",

          "--info-bg": "var(--surface-2)",
          "--info-text": "var(--accent-data)",
          "--info-border": "var(--accent-data)",

          "--warning-bg": "var(--surface-2)",
          "--warning-text": "var(--accent-premium)",
          "--warning-border": "var(--accent-premium)",

          "--border-radius": "var(--radius-md)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
