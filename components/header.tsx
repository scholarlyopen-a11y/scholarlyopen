"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, Globe, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import { LogoSO } from "./logo-so"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const journalsList = [
    { name: t("journals.ss.title"), href: "/journals/social-sciences-humanities" },
    { name: t("journals.bio.title"), href: "/journals/biology" },
    { name: t("journals.chem.title"), href: "/journals/chemistry" },
    { name: t("journals.med.title"), href: "/journals/medicine" },
    { name: t("journals.eng.title"), href: "/journals/engineering" },
    { name: t("journals.env.title"), href: "/journals/environmental-science" },
  ]

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.journals"), href: "#", children: [], isJournals: true },
    {
      name: t("nav.forAuthors"),
      href: "#",
      children: [
        { name: t("nav.authorGuidelines"), href: "/author-guidelines" },
        { name: t("nav.submitManuscript"), href: "/submit" },
        { name: t("nav.apcFees"), href: "/apc-fees" },
      ],
    },
    {
      name: t("nav.policies"),
      href: "#",
      children: [
        { name: t("nav.aimsScope"), href: "/aims-scope" },
        { name: t("nav.peerReview"), href: "/peer-review" },
        { name: t("nav.publicationEthics"), href: "/publication-ethics" },
        { name: t("nav.openAccess"), href: "/open-access" },
      ],
    },
    { name: t("nav.trainings"), href: "/trainings" },
    { name: t("nav.contact"), href: "/contact" },
  ]

  return (
    <header 
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-mid) 45%, var(--primary-dark) 100%)',
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 lg:px-6 xl:px-8">
        <div className="flex shrink-0 items-center">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <div className="flex h-10 w-[145px] sm:h-12 sm:w-[170px] lg:h-12 lg:w-[175px] xl:h-14 xl:w-[240px] 2xl:w-[280px] shrink-0 items-center">
              <LogoSO variant="lockup" className="h-full w-auto object-contain" priority />
            </div>
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-1 sm:gap-2">
          {/* Theme Toggle Mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-[var(--primary-foreground)] hover:bg-primary/10 h-8 w-8 p-0 cursor-pointer"
            title={mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-300" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Language Toggle Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-[var(--primary-foreground)] hover:bg-primary/10 h-8 px-2 text-xs">
                <Globe className="h-3.5 w-3.5 mr-1" />
                {language.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-muted" : ""}>
                {t("language.en")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("de")} className={language === "de" ? "bg-muted" : ""}>
                {t("language.de")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="-m-1.5 inline-flex items-center justify-center rounded-md p-2 text-[var(--primary-foreground)] hover:bg-primary/10 cursor-pointer"
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Navigation - Home link omitted since Logo navigates Home, preserving horizontal breathing room */}
        <div className="hidden lg:flex lg:gap-x-0.5 xl:gap-x-1 items-center justify-center flex-1 min-w-0 px-1.5 overflow-hidden">
          {navigation
            .filter((item) => item.name !== t("nav.home"))
            .map((item) =>
              item.children ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-[11px] xl:text-xs 2xl:text-sm font-semibold text-[var(--primary-foreground)] hover:bg-primary/10 whitespace-nowrap px-1.5 xl:px-2 py-1 h-8 xl:h-9">
                      {item.name}
                      <ChevronDown className="ml-0.5 h-2.5 w-2.5 xl:h-3 xl:w-3 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    {item.isJournals ? (
                      journalsList.map((child) => (
                        <DropdownMenuItem key={child.name} asChild>
                          <Link href={child.href} className="w-full cursor-pointer text-sm">
                            {child.name}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      item.children.map((child) => (
                        <DropdownMenuItem key={child.name} asChild>
                          <Link href={child.href} className="w-full cursor-pointer text-sm">
                            {child.name}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-1.5 xl:px-2 py-1 text-[11px] xl:text-xs 2xl:text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-colors whitespace-nowrap"
                >
                  {item.name}
                </Link>
              )
            )}
        </div>

        <div className="hidden lg:flex items-center justify-end gap-1 xl:gap-2 shrink-0">
          {/* Theme Toggle Desktop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-[var(--primary-foreground)] hover:bg-primary/10 h-8 w-8 p-0 shrink-0 cursor-pointer"
            title={mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-300" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Language Toggle Dropdown Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-[var(--primary-foreground)] hover:bg-primary/10 px-1.5 xl:px-2 py-1 text-[11px] xl:text-xs font-semibold shrink-0 cursor-pointer flex items-center h-8">
                <Globe className="h-3 w-3 xl:h-3.5 xl:w-3.5 mr-1 opacity-90" />
                {language.toUpperCase()}
                <ChevronDown className="ml-0.5 h-2.5 w-2.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem 
                onClick={() => setLanguage("en")} 
                className={`cursor-pointer text-sm font-medium ${language === "en" ? "bg-muted font-bold" : ""}`}
              >
                {t("language.en")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage("de")} 
                className={`cursor-pointer text-sm font-medium ${language === "de" ? "bg-muted font-bold" : ""}`}
              >
                {t("language.de")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="accent" asChild className="border border-accent/60 text-xs xl:text-sm px-2.5 py-1 xl:px-3.5 xl:py-1.5 whitespace-nowrap shrink-0 h-8 xl:h-9">
            <Link href="/submit">
              <span className="lg:inline xl:hidden">Submit</span>
              <span className="hidden xl:inline">{t("nav.submitManuscript")}</span>
            </Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background max-h-[calc(100dvh-4.5rem)] overflow-y-auto shadow-xl">
          <div className="space-y-1 px-4 py-4">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name} className="space-y-1">
                  <span className="block px-3 py-2 text-sm font-semibold text-foreground">
                    {item.name}
                  </span>
                  {item.isJournals ? (
                    <div className="space-y-1 pt-1">
                      {journalsList.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-6 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-6 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {item.name}
                </Link>
              )
            )}
            <div className="pt-4 flex flex-col gap-2">
              <Button variant="accent" asChild className="w-full border border-accent/60">
                <Link href="/submit" onClick={() => setMobileMenuOpen(false)}>
                  {t("nav.submitManuscript")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
