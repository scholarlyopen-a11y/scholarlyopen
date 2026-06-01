"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import { LogoSO } from "./logo-so"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const journals = [
    { name: t("journals.ss.title"), href: "/journals/social-sciences", type: "Gold OA" },
    { name: t("journals.bio.title"), href: "/journals/biology", type: "Gold OA" },
    { name: t("journals.chem.title"), href: "/journals/chemistry", type: "Gold OA" },
    { name: t("journals.med.title"), href: "/journals/medicine", type: "Gold OA" },
    { name: t("journals.ds.title"), href: "/journals/data-science", type: "Gold OA" },
    { name: t("journals.eng.title"), href: "/journals/engineering", type: "Gold OA" },
    { name: t("journals.env.title"), href: "/journals/environmental-science", type: "Gold OA" },
  ]

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.journals"), href: "#", children: journals, isJournals: true },
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
    { name: t("nav.contact"), href: "/contact" },
  ]

  return (
    <header 
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-mid) 45%, var(--primary-dark) 100%)',
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
            <div className="flex h-16 w-[250px] shrink-0 items-center sm:h-20 sm:w-[330px] lg:w-[360px]">
              <LogoSO variant="lockup" className="h-full w-auto object-contain" priority />
            </div>
          </Link>
        </div>

        <div className="flex lg:hidden gap-2">
          {/* Language Toggle Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-[var(--primary-foreground)] hover:bg-primary/10">
                <Globe className="h-4 w-4 mr-1" />
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
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[var(--primary-foreground)] hover:bg-primary/10"
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-0.5 xl:gap-x-1">
          {navigation.map((item) =>
            item.children ? (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-[var(--primary-foreground)] hover:bg-primary/10 whitespace-nowrap px-1.5 lg:px-2 xl:px-3">
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {item.isJournals ? (
                    <>
                      <DropdownMenuLabel className="text-xs text-muted-foreground">{t("nav.goldOA")}</DropdownMenuLabel>
                      {item.children.filter(j => j.type === "Gold OA").map((child) => (
                        <DropdownMenuItem key={child.name} asChild>
                          <Link href={child.href} className="w-full cursor-pointer">
                            {child.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      {item.children.some(j => j.type === "Hybrid OA") && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-xs text-muted-foreground">{t("nav.hybridOA")}</DropdownMenuLabel>
                          {item.children.filter(j => j.type === "Hybrid OA").map((child) => (
                            <DropdownMenuItem key={child.name} asChild>
                              <Link href={child.href} className="w-full cursor-pointer">
                                {child.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    item.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild>
                        <Link href={child.href} className="w-full cursor-pointer">
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
                className="px-1.5 lg:px-2 xl:px-3 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-3">
          {/* Language Toggle Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-[var(--primary-foreground)] hover:bg-primary/10">
                <Globe className="h-4 w-4 mr-1" />
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
          
          <Button variant="secondary" asChild className="bg-secondary text-secondary-foreground border border-secondary/60 shadow-sm hover:bg-secondary/90">
            <Link href="/submit">{t("nav.submitManuscript")}</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="space-y-1 px-4 py-4">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name} className="space-y-1">
                  <span className="block px-3 py-2 text-sm font-semibold text-foreground">
                    {item.name}
                  </span>
                  {item.isJournals && (
                    <span className="block px-6 py-1 text-xs text-muted-foreground font-medium">{t("nav.goldOA")}</span>
                  )}
                  {item.children.filter(c => !item.isJournals || ("type" in c && c.type === "Gold OA")).map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-6 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      {child.name}
                    </Link>
                  ))}
                  {item.isJournals && item.children.some(c => "type" in c && c.type === "Hybrid OA") && (
                    <>
                      <span className="block px-6 py-1 text-xs text-muted-foreground font-medium mt-2">{t("nav.hybridOA")}</span>
                      {item.children.filter(c => "type" in c && c.type === "Hybrid OA").map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-6 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </>
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
            <div className="pt-4">
              <Button asChild className="w-full">
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
