'use client';

import { Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/components/theme-provider";
import { Wordmark } from "@/components/darkroom/wordmark";
import LanguageSelector from "@/components/language-selector";
import { AccountMenu } from "@/components/account/account-menu";
import { AccountSheetLinks } from "@/components/account/account-sheet-links";
import { useLocalization } from "@/i18n/useLocalization";
import React from "react";
import { cn } from "@/lib/utils";

/**
 * A nav link is active when the URL exactly matches its href, or — for any
 * non-root link — when the URL is a sub-path (e.g. `/blog/video/...` keeps
 * "Blog" highlighted). Home is intentionally only active on `/` so it does
 * not match every page.
 */
const isNavActive = (currentPath: string, linkHref: string): boolean => {
  if (linkHref === "/") return currentPath === "/";
  return currentPath === linkHref || currentPath.startsWith(`${linkHref}/`);
};

// Link metadata: titles + descriptions are translated at render time so the
// nav stays in sync with whatever language is currently active.
const NAV_LINKS: { key: string; href: string }[] = [
  { key: "home", href: "/" },
  { key: "tools", href: "/tools" },
  { key: "about", href: "/about" },
  { key: "howItWorks", href: "/how-it-works" },
  { key: "tutorials", href: "/tutorials" },
  { key: "blog", href: "/blog" },
  { key: "privacyPolicy", href: "/privacy-policy" },
  { key: "termsOfService", href: "/terms-of-service" },
  // { key: "blog", href: "/blog" },
];

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = useLocalization("accessibility");
  const isDark = resolvedTheme === "dark";

  // Was a 16-inline-SVG day/night scene (3 moon dots, 3 light rays, 6 clouds,
  // 4 stars) animating on an infinite loop in the sticky header of every page.
  // Now two icons crossfading on transform + opacity only. The 32px visual box
  // keeps the chrome tight; the ::after inset extends the hit area to 44px.
  return (
    <Toggle
      size="sm"
      pressed={isDark}
      // Theme is binary and dark-first; only an explicit choice of light
      // switches away from the darkroom.
      onPressedChange={(next) => setTheme(next ? "dark" : "light")}
      aria-label={t("topNav.toggleTheme")}
      className={cn(
        "relative size-8 shrink-0 px-0 text-muted-foreground hover:bg-surface-2 hover:text-foreground",
        "data-[state=on]:bg-transparent data-[state=on]:text-foreground",
        "after:absolute after:-inset-1.5 after:content-['']"
      )}
    >
      <Sun
        aria-hidden="true"
        className={cn(
          "absolute size-4 transition-all duration-[var(--dur-base)] ease-[var(--ease-instrument)]",
          isDark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          "absolute size-4 transition-all duration-[var(--dur-base)] ease-[var(--ease-instrument)]",
          isDark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
        )}
      />
    </Toggle>
  );
};


const TopNav: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { t } = useLocalization(["interface", "accessibility"]);
  const components = NAV_LINKS.map((link) => ({
    key: link.key,
    href: link.href,
    title: t(`interface:topNav.${link.key}`),
  }));

  return (
    <nav data-site-header className="sticky top-0 z-50 w-full border-b border-edge bg-surface-0/92 shadow-[0_1px_0_var(--edge-highlight)]">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:h-16">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity" aria-label={t("accessibility:topNav.homeLink")}>
          {/* Was an unsized 80x80 image tag (22% of a 360px viewport, and a CLS
              source) plus Rubik Glitch type. Now a CSS-only lockup. */}
          <Wordmark size="sm" text={t("interface:common.brand")} />
          <span className="hidden border-l border-edge pl-3 text-xs text-muted-foreground lg:block">
            {t("interface:common.brandTagline")}
          </span>
        </Link>

        {/* Desktop Navigation */}
        {/* Eight links do not fit at 768px next to the account slot — at that
            width the row squeezed the nav past the viewport edge. The desktop
            row starts at lg; 768-1023 uses the same sheet as a phone. */}
        <NavigationMenu viewport={false} className="hidden lg:flex">
          <NavigationMenuList>
            {components.map((component) => {
              const active = isNavActive(pathname, component.href);
              return (
                <NavigationMenuItem key={component.key}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={component.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative px-3 py-2 text-sm transition-colors duration-[var(--dur-base)] ease-[var(--ease-instrument)]",
                        "after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:bg-primary",
                        "after:transition-transform after:duration-[var(--dur-base)] after:ease-[var(--ease-instrument)]",
                        active
                          ? "font-semibold text-foreground after:scale-x-100"
                          : "font-medium text-muted-foreground hover:text-foreground after:scale-x-0"
                      )}
                    >
                      {component.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-2">
          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full !bg-transparent hover:!bg-surface-2 dark:hover:!bg-surface-2 [&]:bg-transparent"
              >
                <Menu className="h-6 w-6 text-foreground" />
                <span className="sr-only">{t("accessibility:topNav.openMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[80dvh]">
              <SheetHeader>
                <SheetTitle>{t("interface:topNav.navigationLabel")}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4 overflow-y-auto max-h-[60dvh]">
                {components.map((component) => {
                  const active = isNavActive(pathname, component.href);
                  return (
                    <Link
                      key={component.key}
                      href={component.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex min-h-[44px] items-center justify-center rounded-md px-4 py-2 text-lg transition-colors",
                        active
                          ? "border-l-2 border-l-primary bg-surface-2 font-semibold text-foreground"
                          : "font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                      )}
                    >
                      {component.title}
                    </Link>
                  );
                })}
                <AccountSheetLinks onNavigate={() => setIsOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <ThemeToggle />
          <LanguageSelector />
          {/* Auth slot. Phase 2 reserved 88px here so filling it in Phase 4
              would cost no layout shift; AccountMenu holds that width in every
              state, including while the tier is still resolving. */}
          <div data-auth-slot className="flex min-w-[88px] justify-end">
            <AccountMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
