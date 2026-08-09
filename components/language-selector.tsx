'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/i18n/useLocalization";
import { cn } from "@/lib/utils";

/**
 * Dropdown that lets the visitor switch between the languages registered in
 * `src/i18n/resources.ts`. Persists the selection through `useLocalization`,
 * which writes to localStorage and updates `document.documentElement.lang`.
 *
 * The trigger mirrors the styling of the GitHub / WinApps / CreaTV icon
 * buttons in TopNav so it sits naturally next to ThemeToggle.
 *
 * Renders nothing while only one language is registered — a picker with a
 * single option is a control that cannot do anything, and it occupies a 44px
 * slot in the sticky nav on every route. The component and its i18n wiring
 * stay intact, so adding a second entry to `supportedLanguages` brings it back
 * with no other change.
 */
const LanguageSelector: React.FC = () => {
  const { t } = useLocalization(["interface", "accessibility"]);
  const { language, languages, changeLanguage } = useLocalization();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerLabel = t("accessibility:languageSelector.trigger", {
    defaultValue: "Change language",
  });

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = useCallback(
    (code: string) => {
      // changeLanguage records the preference (localStorage + cookie) and
      // NAVIGATES to the same path under the new locale prefix — the URL is
      // the source of truth for language, so both server- and client-rendered
      // strings follow from the new route.
      void changeLanguage(code);
      setOpen(false);
    },
    [changeLanguage],
  );

  // Declared after every hook so the hook order stays stable.
  if (languages.length < 2) return null;

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={triggerLabel}
        title={triggerLabel}
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full !bg-transparent hover:!bg-surface-2 dark:hover:!bg-surface-2 [&]:bg-transparent"
      >
        <Languages className="h-6 w-6 text-foreground" aria-hidden="true" />
        <span className="sr-only">{triggerLabel}</span>
      </Button>
      {open && (
        <div
          role="listbox"
          aria-label={t("interface:languageSelector.select", {
            defaultValue: "Select a language",
          })}
          className="absolute right-0 mt-2 w-56 max-h-72 overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-lg z-50"
        >
          <ul className="py-1">
            {languages.map((entry) => {
              const isActive = entry.code === language.code;
              return (
                <li key={entry.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(entry.code)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition-colors",
                      isActive && "font-semibold",
                    )}
                  >
                    {entry.flag && (
                      <span aria-hidden="true" className="text-base leading-none">
                        {entry.flag}
                      </span>
                    )}
                    <span className="flex-1">
                      {entry.label}
                      {entry.englishLabel !== entry.label && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {entry.englishLabel}
                        </span>
                      )}
                    </span>
                    {isActive && <Check className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
