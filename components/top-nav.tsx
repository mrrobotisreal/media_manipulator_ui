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
import { useLocalizedHref } from "@/i18n/useLocalizedHref";
import { stripLocalePrefix } from "@/i18n/locales";
import React from "react";
import { cn } from "@/lib/utils";
import { NAV_ICON_CONTROL } from "@/components/nav-control";

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
// `desktop: false` keeps a link out of the desktop row but in the mobile sheet.
// The legal pages are linked from the footer on every page, and the desktop
// row has no room for them: with them, the links need 1297px (English) to
// 1432px (Russian) on one line, which either wrapped two-word links onto two
// lines or pushed the row off-screen on a 1280-1440px laptop.
const NAV_LINKS: { key: string; href: string; desktop?: false }[] = [
  { key: "home", href: "/" },
  { key: "tools", href: "/tools" },
  { key: "voices", href: "/voices" },
  { key: "about", href: "/about" },
  { key: "howItWorks", href: "/how-it-works" },
  { key: "tutorials", href: "/tutorials" },
  { key: "blog", href: "/blog" },
  { key: "privacyPolicy", href: "/privacy-policy", desktop: false },
  { key: "termsOfService", href: "/terms-of-service", desktop: false },
  // { key: "blog", href: "/blog" },
];

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = useLocalization("accessibility");
  const isDark = resolvedTheme === "dark";

  // Was a 16-inline-SVG day/night scene (3 moon dots, 3 light rays, 6 clouds,
  // 4 stars) animating on an infinite loop in the sticky header of every page.
  // Now two icons crossfading on transform + opacity only. MM88: the same 36px
  // visual box + 4px ::after extension as the other three nav controls (44px
  // hit area, see components/nav-control.ts).
  return (
    <Toggle
      size="sm"
      pressed={isDark}
      // Theme is binary and dark-first; only an explicit choice of light
      // switches away from the darkroom.
      onPressedChange={(next) => setTheme(next ? "dark" : "light")}
      aria-label={t("topNav.toggleTheme")}
      className={cn(
        NAV_ICON_CONTROL,
        "px-0 text-muted-foreground hover:bg-surface-2 hover:text-foreground",
        "data-[state=on]:bg-transparent data-[state=on]:text-foreground"
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
  const localized = useLocalizedHref();
  // Active state is computed on locale-NEUTRAL paths: under a locale prefix,
  // Home's localized href is `/ru`, and every `/ru/...` pathname starts with
  // it — so matching localized-vs-localized kept Home lit on every page. The
  // localized href is only for the <Link>.
  const neutralPath = stripLocalePrefix(pathname ?? "/");
  const components = NAV_LINKS.map((link) => ({
    key: link.key,
    href: localized(link.href),
    active: isNavActive(neutralPath, link.href),
    title: t(`interface:topNav.${link.key}`),
    desktop: link.desktop !== false,
  }));

  return (
    <nav data-site-header className="sticky top-0 z-50 w-full border-b border-edge bg-surface-0/92 shadow-[0_1px_0_var(--edge-highlight)]">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:h-16">
        <Link href={localized("/")} className="flex min-w-0 items-center gap-3 hover:opacity-90 transition-opacity" aria-label={t("accessibility:topNav.homeLink")}>
          {/* Was an unsized 80x80 image tag (22% of a 360px viewport, and a CLS
              source) plus Rubik Glitch type. Now a CSS-only lockup.

              MM88: below 480px the lockup is the 36px mark alone. With the
              language picker back (MM51) and 44px targets, the controls need
              220px signed out and 244px signed in (three 36px icons, then the
              68px meter + a 36px account trigger, all gap-2): 36 + 244 = 280
              fits the 288px a 320px phone leaves inside px-4. The type (~150px
              at 18px semibold) plus its 10px gap makes it 440px, which fits
              from 472px, hence 480. The
              link's aria-label names it at every width. */}
          <Wordmark size="sm" animated text={t("interface:common.brand")} textClassName="hidden min-[480px]:inline" />
          <span className="hidden border-s border-edge ps-3 text-xs text-muted-foreground 2xl:block">
            {t("interface:common.brandTagline")}
          </span>
        </Link>

        {/* Desktop Navigation */}
        {/* Links never wrap. Measured with every link on one line, the row
            (logo, links, controls) needs up to 1073px (English), so the desktop
            row starts at xl and the tagline beside the logo at 2xl (1280px
            English, 1187px Russian). Below xl the sheet takes over, as on a
            phone. */}
        <NavigationMenu viewport={false} className="hidden xl:flex">
          <NavigationMenuList>
            {components.filter((component) => component.desktop).map((component) => {
              const active = component.active;
              return (
                <NavigationMenuItem key={component.key}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={component.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative whitespace-nowrap px-3 py-2 text-sm transition-colors duration-[var(--dur-base)] ease-[var(--ease-instrument)]",
                        // Grows from the inline start: left in LTR, right in Arabic/Hebrew.
                        "after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 ltr:after:origin-left rtl:after:origin-right after:bg-primary",
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

        {/* gap-2 (8px) is exactly two 4px ::after extensions, so the 44px hit
            areas of neighbouring controls abut without overlapping. */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  NAV_ICON_CONTROL,
                  "xl:hidden rounded-full !bg-transparent hover:!bg-surface-2 dark:hover:!bg-surface-2 [&]:bg-transparent"
                )}
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
                  const active = component.active;
                  return (
                    <Link
                      key={component.key}
                      href={component.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex min-h-[44px] items-center justify-center rounded-md px-4 py-2 text-lg transition-colors",
                        active
                          ? "border-s-2 border-s-primary bg-surface-2 font-semibold text-foreground"
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
