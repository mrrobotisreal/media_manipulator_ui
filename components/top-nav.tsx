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
import { useLocalization } from "@/i18n/useLocalization";
import React from "react";
import { cn } from "@/lib/utils";

// Glow style used on the currently-active nav link. Inlined so we don't have
// to register a global text-shadow utility — Tailwind v4 arbitrary values trip
// over the comma syntax that text-shadow's layered form requires.
const NAV_ACTIVE_GLOW: React.CSSProperties = {
  textShadow: '0 0 8px rgb(96, 165, 250), 0 0 16px rgb(96, 165, 250)',
};

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
      // Drive off the *resolved* theme so the icon state always matches what is
      // actually on screen (including a stored "system" value).
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
    <nav data-site-header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-edge shadow-[0_1px_0_var(--edge-highlight)]">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity" aria-label={t("accessibility:topNav.homeLink")}>
          {/* Was an unsized 80x80 image tag (22% of a 360px viewport, and a CLS
              source) plus Rubik Glitch type. Now a CSS-only lockup. */}
          <Wordmark size="sm" text={t("interface:common.brand")} />
          <span className="hidden border-l border-edge pl-3 text-xs text-muted-foreground lg:block">
            {t("interface:common.brandTagline")}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu viewport={false} className="hidden md:flex">
          <NavigationMenuList>
            {components.map((component) => {
              const active = isNavActive(pathname, component.href);
              return (
                <NavigationMenuItem key={component.key}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={component.href}
                      aria-current={active ? "page" : undefined}
                      style={active ? NAV_ACTIVE_GLOW : undefined}
                      className={cn("transition-colors px-3 py-2 text-sm", active ? "font-black text-blue-300" : "font-medium text-white hover:text-gray-300")}
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
                className="md:hidden rounded-full !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 [&]:bg-transparent"
              >
                <Menu className="h-6 w-6 text-white" />
                <span className="sr-only">{t("accessibility:topNav.openMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[80vh]">
              <SheetHeader>
                <SheetTitle>{t("interface:topNav.navigationLabel")}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4 overflow-y-auto max-h-[60vh]">
                {components.map((component) => {
                  const active = isNavActive(pathname, component.href);
                  return (
                    <Link
                      key={component.key}
                      href={component.href}
                      aria-current={active ? "page" : undefined}
                      style={active ? NAV_ACTIVE_GLOW : undefined}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2 text-lg text-center rounded-md transition-colors ${
                        active
                          ? "font-bold text-blue-400"
                          : "font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {component.title}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>

          {/* <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 [&]:bg-transparent"
          >
            <a
              href="https://github.com/mrrobotisreal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={githubLogo} alt={t("accessibility:topNav.githubLogo")} className="h-6 w-6 dark:invert" />
              <span className="sr-only">{t("accessibility:topNav.github")}</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 [&]:bg-transparent"
          >
            <a
              href="https://www.winapps.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={winappsLogo}
                alt={t("accessibility:topNav.winappsLogo")}
                className="h-12 w-12"
              />
              <span className="sr-only">{t("accessibility:topNav.winapps")}</span>
            </a>
          </Button> */}
          {/* <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 [&]:bg-transparent"
          >
            <a
              href="https://www.creatv.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={creatvLogo}
                alt={t("accessibility:topNav.creatvLogo")}\
                className="h-12 w-12"
              />
              <span className="sr-only">{t("accessibility:topNav.creatv")}</span>
            </a>
          </Button> */}
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
