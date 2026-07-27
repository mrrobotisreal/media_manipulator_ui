'use client';

import { createContext, useContext, useEffect, useState } from "react";

/**
 * Theme is binary and dark-first.
 *
 * Dark is the product default and the assumption whenever there is no explicit
 * user choice. Light exists for people who prefer it, their choice is
 * remembered, and nothing else can flip them into it — in particular the OS
 * `prefers-color-scheme` is deliberately NOT consulted, so a visitor on a light
 * desktop still gets the darkroom until they ask otherwise.
 *
 * "system" was a third option in the old Vite app and shared this storage key.
 * It is gone: a stale "system" value now resolves to dark and is rewritten to
 * "dark" on first mount, so it cannot keep silently yielding light.
 */
type Theme = "dark" | "light";

const STORAGE_KEY = "vite-ui-theme";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  /** The active theme. Binary — there is no "system". */
  theme: Theme;
  /**
   * Kept as a distinct field for call-site compatibility (top-nav, sonner).
   * Now always equal to `theme`, since nothing needs resolving.
   */
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/** Anything that is not exactly "light" means dark. */
function readStoredTheme(storageKey: string): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    return localStorage.getItem(storageKey) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeProvider({
  children,
  // Dark mode is the product default. A returning visitor's stored choice
  // still wins over this.
  defaultTheme = "dark",
  storageKey = STORAGE_KEY,
  ...props
}: ThemeProviderProps) {
  // Server and first client render agree deterministically: both are dark
  // unless a stored "light" says otherwise, matching THEME_INIT in layout.tsx.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return readStoredTheme(storageKey);
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Normalise any legacy value ("system", or junk) to an explicit choice so
    // it can never be re-interpreted as light later.
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== "dark" && stored !== "light") {
        localStorage.setItem(storageKey, theme);
      }
    } catch {
      // Private browsing / storage disabled — the in-memory theme still holds.
    }
  }, [theme, storageKey]);

  const value: ThemeProviderState = {
    theme,
    resolvedTheme: theme,
    setTheme: (next: Theme) => {
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        // Ignore write failures; the toggle still works for this session.
      }
      setTheme(next);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
