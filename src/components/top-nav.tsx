import { Sun, Menu } from "lucide-react";
import { MoonIcon as Moon } from "@radix-ui/react-icons";
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
import winappsLogo from "@/assets/logo_transparent_shadow.svg";
import formatterIcon from "@/assets/MediaManipulatorIcon.webp";
import githubLogo from "@/assets/github.svg";
import React from "react";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Home",
    href: "/",
    description:
      "Home page where you can convert your files",
  },
  {
    title: "About",
    href: "/about",
    description:
      "About page where you can learn more about the project and its creator",
  },
  {
    title: "How it works",
    href: "/how-it-works",
    description:
      "How it works page where you can learn more about the conversion process",
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    description: "Privacy policy page where you can learn more about the privacy policy of the project",
  },
  {
    title: "Terms of Service",
    href: "/terms-of-service",
    description:
      "Terms of service page where you can learn more about the terms of service of the project",
  },
  {
    title: "Blog",
    href: "/blog",
    description:
      "Blog page where you can read the latest news and updates about the project",
  },
]

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 [&]:bg-transparent"
    >
      <Sun className="h-10 w-10 rotate-0 scale-100 transition-all text-gray-700 dark:text-gray-200 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-10 w-10 rotate-90 scale-0 transition-all text-gray-700 dark:text-gray-200 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

const TopNav: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={formatterIcon}
            alt="Media Manipulator Icon"
            className="h-10 w-10 rounded-sm"
          />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight hidden sm:block">Media Manipulator Pro</h1>
            <p className="text-xs md:text-sm text-gray-300 hidden sm:block">Convert images, videos, and audio files with ease</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu viewport={false} className="hidden md:flex">
          <NavigationMenuList>
            {components.map((component) => (
              <NavigationMenuItem key={component.title}>
                <NavigationMenuLink asChild>
                  <a href={component.href} className="text-white hover:text-gray-300 transition-colors px-3 py-2 text-sm font-medium">
                    {component.title}
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
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
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[80vh]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4 overflow-y-auto max-h-[60vh]">
                {components.map((component) => (
                  <a
                    key={component.title}
                    href={component.href}
                    className="block px-4 py-2 text-lg text-center font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {component.title}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 [&]:bg-transparent"
          >
            <a
              href="https://github.com/mrrobotisreal/text_formatter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={githubLogo} alt="GitHub" className="h-6 w-6 dark:invert" />
              <span className="sr-only">View on GitHub</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 [&]:bg-transparent"
          >
            <a
              href="https://winapps.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={winappsLogo}
                alt="WinApps Logo"
                className="h-12 w-12"
              />
              <span className="sr-only">WinApps</span>
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
