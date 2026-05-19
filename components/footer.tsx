"use client"

import Link from "next/link"
import { Mail } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { LogoSO } from "./logo-so"

// Compliance Badge Component
function ComplianceBadge({ name, abbr, description }: { name: string; abbr: string; description: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-secondary/20 rounded-lg" title={description}>
      <div className="flex h-8 w-8 items-center justify-center rounded bg-secondary text-secondary-foreground text-[11px] font-bold shrink-0">
        {abbr}
      </div>
      <span className="text-sm font-medium text-white/90">{name}</span>
    </div>
  )
}

const socialLinks = [
  {
    name: "X (Twitter)",
    href: "https://twitter.com/scholarlyopen",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/scholarlyopen",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "ResearchGate",
    href: "https://researchgate.net/institution/scholarlyopen",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10Zm2.25-6.07V16H9.8v-8h3.09c1.58 0 2.74 1.24 2.74 2.7 0 1.13-.6 1.77-1.31 2.12V12c.83-.28 1.26-1.06 1.26-2.04 0-1.42-1.16-2.35-2.69-2.35H9.8V16h2.45V13.4h.1c.45.22.91.34 1.37.34 1.46 0 2.68-.83 2.68-2.59 0-1.73-1.26-2.67-2.91-2.67-.81 0-1.51.23-2.04.62V6.58c.5-.15 1.15-.24 1.76-.24 3.33 0 5.7 2.12 5.7 5.95 0 3.84-2.37 5.95-5.7 5.95-.7 0-1.4-.07-2.07-.26Z" />
      </svg>
    ),
  },
  {
    name: "ORCID",
    href: "https://orcid.org/",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
      </svg>
    ),
  },
]

export function Footer() {
  const { t } = useLanguage()

  const footerLinks = {
    journals: [
      { name: t("journals.ss.title"), href: "/journals/social-sciences" },
      { name: t("journals.bio.title"), href: "/journals/biology" },
      { name: t("journals.chem.title"), href: "/journals/chemistry" },
      { name: t("journals.med.title"), href: "/journals/medicine" },
      { name: t("journals.ds.title"), href: "/journals/data-science" },
      { name: t("journals.eng.title"), href: "/journals/engineering" },
      { name: t("journals.env.title"), href: "/journals/environmental-science" },
    ],
    forAuthors: [
      { name: t("nav.authorGuidelines"), href: "/author-guidelines" },
      { name: t("nav.submitManuscript"), href: "/submit" },
      { name: t("nav.apcFees"), href: "/apc-fees" },
      { name: t("nav.peerReview"), href: "/peer-review" },
    ],
    aboutUs: [
      { name: t("nav.about"), href: "/about" },
      { name: t("nav.aimsScope"), href: "/aims-scope" },
      { name: t("nav.contact"), href: "/contact" },
    ],
    policies: [
      { name: t("nav.openAccess"), href: "/open-access" },
      { name: t("nav.publicationEthics"), href: "/publication-ethics" },
      { name: t("footer.archiving"), href: "/archiving-indexing" },
      { name: t("footer.privacy"), href: "/privacy" },
      { name: t("footer.impressum"), href: "/impressum" },
    ],
  }

  const complianceBadges = [
    { name: t("compliance.doaj"), abbr: "DOAJ", description: "Directory of Open Access Journals - We follow DOAJ best practices for open access publishing" },
    { name: t("compliance.cope"), abbr: "COPE", description: "Committee on Publication Ethics - We adhere to COPE guidelines for publication ethics" },
    { name: t("compliance.crossref"), abbr: "DOI", description: "CrossRef Member - All articles receive DOI for permanent identification" },
    { name: t("compliance.ccby"), abbr: "CC", description: "Creative Commons CC BY 4.0 - Open licensing for maximum accessibility" },
  ]

  return (
    <footer 
      className="text-white"
      style={{
        background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-mid) 45%, var(--primary-dark) 100%)'
      }}
    >
      {/* Compliance Bar */}
      <div className="border-b border-[var(--primary-foreground)]/20">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">{t("compliance.title")}</h3>
              <p className="mt-1 text-xs text-white/60">Committed to the highest standards in scholarly publishing</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {complianceBadges.map((badge) => (
                <ComplianceBadge key={badge.abbr} {...badge} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                  <LogoSO />
                </div>
              <span className="text-lg font-semibold">{t("brand.name")}</span>
            </Link>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              {t("brand.description")}
            </p>
            <div className="mt-6 space-y-3 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:info@scholarlyopen.org" className="break-all hover:text-white transition-colors">
                  info@scholarlyopen.org
                </a>
              </div>
            </div>
            {/* Social Media */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-secondary/20 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 block" />
                </a>
              ))}
            </div>
          </div>

          {/* Journals */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">{t("footer.journals")}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.journals.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Authors */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">{t("footer.forAuthors")}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.forAuthors.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">{t("footer.aboutUs")}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.aboutUs.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">{t("footer.policies")}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.policies.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--primary-foreground)]/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-white/60">
              &copy; {new Date().getFullYear()} {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <Link href="/privacy" className="hover:text-white transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link href="/impressum" className="hover:text-white transition-colors">
                {t("footer.impressum")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
