'use client';

import { Menu } from "lucide-react";
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
import { useTheme } from "@/components/theme-provider";
import LanguageSelector from "@/components/language-selector";
import { useLocalization } from "@/i18n/useLocalization";
// import winappsLogo from "@/assets/WinApps_Logo_Medium.png";
const mmIcon = "/MMIcon.webp";
// import githubLogo from "@/assets/github.svg";
// import creatvLogo from "@/assets/CreaTV_Logo_240x240.png";
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

  return (
    <label className="switch">
      <input
        className="theme-toggle-input"
        type="checkbox"
        aria-label={t("topNav.toggleTheme")}
        // Drive off the *resolved* theme so the moon/stars vs sun/clouds state
        // always matches what's actually on screen (incl. a "system" value).
        onChange={() => setTheme(isDark ? "light" : "dark")}
        checked={isDark}
      />
      <div className="slider round">
        <div className="sun-moon">
          <svg className="moon-dot moon-dot-1" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className="moon-dot moon-dot-2" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className="moon-dot moon-dot-3" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className="light-ray light-ray-1" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className="light-ray light-ray-2" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className="light-ray light-ray-3" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>

          <svg className="cloud-dark cloud-1" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className="cloud-dark cloud-2" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className="cloud-dark cloud-3" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className="cloud-light cloud-4" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className="cloud-light cloud-5" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className="cloud-light cloud-6" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
        </div>
        <div className="stars">
          <svg className="star star-1" viewBox="0 0 20 20">
            <path
              d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
            ></path>
          </svg>
          <svg className="star star-2" viewBox="0 0 20 20">
            <path
              d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
            ></path>
          </svg>
          <svg className="star star-3" viewBox="0 0 20 20">
            <path
              d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
            ></path>
          </svg>
          <svg className="star star-4" viewBox="0 0 20 20">
            <path
              d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
            ></path>
          </svg>
        </div>
      </div>
    </label>
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
    <nav className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 sci-fi-frame-bottom">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity" aria-label={t("accessibility:topNav.homeLink")}>
          <img
            src={mmIcon}
            alt={t("accessibility:topNav.navIcon")}
            className="h-20 w-20 rounded-sm"
          />
          <div className="flex flex-col">
            <span className="font-glitch text-lg md:text-2xl text-white leading-tight hidden sm:block">{t("interface:common.brand")}</span>
            <span className="text-xs md:text-sm text-gray-300 hidden sm:block">{t("interface:common.brandTagline")}</span>
          </div>
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
