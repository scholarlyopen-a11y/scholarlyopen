"use client"

import Link from "next/link"
import { Mail } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

// Compliance Badge Component
function ComplianceBadge({ name, abbr, description }: { name: string; abbr: string; description: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg" title={description}>
      <div className="flex h-8 w-8 items-center justify-center rounded bg-accent text-accent-foreground text-[11px] font-bold shrink-0">
        {abbr}
      </div>
      <span className="text-sm font-medium text-white/90">{name}</span>
    </div>
  )
}

const socialLinks = [
  {
    name: "X (Twitter)",
    href: "https://twitter.com/peerrex",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/peerrex",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "ResearchGate",
    href: "https://researchgate.net/institution/peerrex",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.078.53 9 9 0 0 0-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.121 0 0 0 .014 1.017 9 9 0 0 0 .05.727 7.946 7.946 0 0 0 .078.53h-.005a3.334 3.334 0 0 0 .112.438c.243.743.65 1.303 1.213 1.68.566.376 1.256.564 2.073.564.8 0 1.536-.213 2.105-.603.57-.39.94-.916 1.175-1.65.076-.235.135-.558.177-.93a10.9 10.9 0 0 0 .043-1.207v-.82c0-.095-.047-.142-.14-.142h-3.064c-.094 0-.14.047-.14.141v.956c0 .094.046.14.14.14h1.666c.056 0 .084.03.084.086 0 .36 0 .62-.036.865-.038.244-.1.447-.147.606-.108.326-.298.573-.564.753a1.364 1.364 0 0 1-.84.27c-.418 0-.778-.127-1.022-.39-.243-.26-.392-.627-.4-1.097a7.77 7.77 0 0 1-.04-.725V5.73c0-.298.013-.58.04-.725.02-.462.166-.827.418-1.097.25-.27.6-.398 1.022-.398.39 0 .714.124.98.373.265.25.417.593.456 1.036.015.1.053.15.152.15h1.595c.094 0 .14-.047.14-.14a3.54 3.54 0 0 0-.143-.873c-.202-.675-.546-1.186-1.06-1.558-.515-.372-1.14-.558-1.87-.558zm-15.062.06a.103.103 0 0 0-.093.06 3.93 3.93 0 0 0-.175.322L.153 7.18a.105.105 0 0 0 .002.103.103.103 0 0 0 .09.052h1.74c.058 0 .097-.033.123-.097L2.56 6.2c.027-.063.083-.094.146-.094h3.114c.063 0 .12.03.146.094l.45 1.043c.026.064.066.097.123.097h1.74a.103.103 0 0 0 .09-.052.105.105 0 0 0 .003-.103l-4.102-6.74a3.93 3.93 0 0 0-.175-.322.103.103 0 0 0-.093-.06h-1.47zM4.538 2.69c.024-.06.068-.086.117-.086s.093.027.117.087l.88 2.048c.03.063.003.11-.063.11H3.723c-.065 0-.092-.047-.063-.11z" />
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
      { name: t("journals.sso.title"), href: "/journals/social-sciences-open" },
      { name: t("journals.af.title"), href: "/journals/archaeological-frontiers" },
      { name: t("journals.mrr.title"), href: "/journals/medical-research-review" },
      { name: t("journals.jahs.title"), href: "/journals/applied-health-sciences" },
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
      { name: t("nav.editorialBoard"), href: "/editorial-board" },
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
        background: 'linear-gradient(135deg, oklch(0.45 0.12 200) 0%, oklch(0.35 0.10 220) 50%, oklch(0.28 0.08 240) 100%)'
      }}
    >
      {/* Compliance Bar */}
      <div className="border-b border-white/10">
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">SCH</span>
              </div>
              <span className="text-lg font-semibold">{t("brand.name")}</span>
            </Link>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              {t("brand.description")}
            </p>
            <div className="mt-6 space-y-3 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:abbas.qurasani+info-scholarisch@gmail.com" className="break-all hover:text-white transition-colors">
                  abbas.qurasani+info-scholarisch@gmail.com
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 block" />
                </a>
              ))}
            </div>
          </div>

          {/* Journals */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">{t("footer.journals")}</h3>
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

        <div className="mt-12 border-t border-white/20 pt-8">
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
