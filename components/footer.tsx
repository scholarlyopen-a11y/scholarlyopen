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

function CcByLogo() {
  return (
    <a 
      href="https://creativecommons.org/licenses/by/4.0/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-block hover:opacity-90 transition-opacity shrink-0"
      title="Creative Commons Attribution 4.0 International License"
    >
      <svg
        width="68"
        height="24"
        viewBox="0 0 120 42"
        className="h-6 w-auto shrink-0 select-none block"
      >
        <g transform="matrix(0.9937728,0,0,0.9936696,-177.69267,6.25128e-7)">
          <path
            d="M 181.96579,0.51074 L 296.02975,0.71338 C 297.6235,0.71338 299.04733,0.47705 299.04733,3.89404 L 298.90768,41.46093 L 179.08737,41.46093 L 179.08737,3.75439 C 179.08737,2.06934 179.25046,0.51074 181.96579,0.51074 z"
            fill="#aab2ab"
          />
          <path
            d="M 297.29636,0 L 181.06736,0 C 179.82078,0 178.80613,1.01416 178.80613,2.26074 L 178.80613,41.75732 C 178.80613,42.03906 179.03513,42.26757 179.31687,42.26757 L 299.04734,42.26757 C 299.32908,42.26757 299.55808,42.03905 299.55808,41.75732 L 299.55808,2.26074 C 299.55807,1.01416 298.54343,0 297.29636,0 z M 181.06735,1.02148 L 297.29635,1.02148 C 297.98043,1.02148 298.53658,1.57714 298.53658,2.26074 C 298.53658,2.26074 298.53658,18.20898 298.53658,29.71045 L 215.19234,29.71045 C 212.14742,35.21631 206.28121,38.95459 199.54879,38.95459 C 192.81344,38.95459 186.94869,35.21973 183.90524,29.71045 L 179.8276,29.71045 C 179.8276,18.20899 179.8276,2.26074 179.8276,2.26074 C 179.82761,1.57715 180.38376,1.02148 181.06735,1.02148 z"
            fill="#000000"
          />
          <g fill="#ffffff">
            <path d="M 253.07761,32.95605 C 253.39499,32.95605 253.68503,32.98437 253.94773,33.04003 C 254.20945,33.09569 254.43308,33.18749 254.62058,33.31542 C 254.8071,33.44237 254.95261,33.6123 255.05515,33.82323 C 255.15769,34.03514 255.20945,34.29589 255.20945,34.60741 C 255.20945,34.94335 255.13328,35.22264 254.97996,35.44628 C 254.82762,35.67089 254.60105,35.85351 254.30223,35.99706 C 254.71434,36.11522 255.02196,36.32226 255.22508,36.61815 C 255.4282,36.91404 255.52977,37.27049 255.52977,37.68749 C 255.52977,38.02343 255.46434,38.31444 255.33348,38.56054 C 255.20262,38.80566 255.02586,39.00683 254.80516,39.1621 C 254.58348,39.31835 254.33055,39.43358 254.04735,39.5078 C 253.76317,39.583 253.47215,39.6201 253.17235,39.6201 L 249.936,39.6201 L 249.936,32.95604 L 253.07761,32.95604 L 253.07761,32.95605 z M 252.89011,35.65137 C 253.15183,35.65137 253.36667,35.58887 253.53562,35.46485 C 253.70359,35.34083 253.78757,35.13965 253.78757,34.86036 C 253.78757,34.70509 253.75925,34.57716 253.70359,34.47852 C 253.64695,34.37891 253.57273,34.30176 253.47898,34.24512 C 253.38523,34.18946 253.27781,34.15039 253.15671,34.12891 C 253.03561,34.10743 252.90866,34.09668 252.77878,34.09668 L 251.40476,34.09668 L 251.40476,35.65137 L 252.89011,35.65137 z M 252.97604,38.47949 C 253.11959,38.47949 253.25631,38.46582 253.38717,38.4375 C 253.51803,38.40918 253.63326,38.3623 253.73385,38.29785 C 253.83346,38.23242 253.91256,38.14355 253.97213,38.03125 C 254.0317,37.91992 254.061,37.77637 254.061,37.60254 C 254.061,37.26074 253.96432,37.0166 253.77096,36.87012 C 253.5776,36.72461 253.32174,36.65137 L 251.40475,36.65137 L 251.40475,38.47949 L 252.97604,38.47949 z" />
            <path d="M 255.78854,32.95605 L 257.43209,32.95605 L 258.99264,35.58789 L 260.54342,32.95605 L 262.17721,32.95605 L 259.70358,37.0625 L 259.70358,39.62012 L 258.23483,39.62012 L 258.23483,37.02539 L 255.78854,32.95605 z" />
          </g>
          <g transform="matrix(0.872921,0,0,0.872921,50.12536,143.2144)">
            <path
              d="M 186.90065,-141.46002 C 186.90623,-132.77923 179.87279,-125.73852 171.19257,-125.73291 C 162.51235,-125.72736 155.47051,-132.76025 155.46547,-141.44098 C 155.46547,-141.44714 155.46547,-141.45331 155.46547,-141.46002 C 155.46043,-150.14081 162.49333,-157.18152 171.17355,-157.18658 C 179.8549,-157.19213 186.89561,-150.15924 186.90065,-141.47845 C 186.90065,-141.4729 186.90065,-141.46619 186.90065,-141.46002 z"
              fill="#ffffff"
            />
            <g transform="translate(-289.6157,99.0653)" fill="#000000">
              <path d="M 473.57574,-253.32751 C 477.06115,-249.8421 478.80413,-245.5736 478.80413,-240.52532 C 478.80413,-235.47594 477.09136,-231.25329 473.66582,-227.85741 C 470.03051,-224.28081 465.734,-222.49309 460.77635,-222.49309 C 455.87858,-222.49309 451.65648,-224.26628 448.11122,-227.81261 C 444.56541,-231.35845 442.79277,-235.59563 442.79277,-240.52532 C 442.79277,-245.45391 444.56541,-249.7213 448.11122,-253.32751 C 451.56642,-256.81402 455.7885,-258.557 460.77635,-258.557 C 465.82465,-258.55701 470.09039,-256.81403 473.57574,-253.32751 z M 450.45776,-250.98267 C 447.51104,-248.00629 446.03823,-244.51978 446.03823,-240.52033 C 446.03823,-236.52198 447.49651,-233.06507 450.41247,-230.14966 C 453.32897,-227.23316 456.80096,-225.77545 460.82952,-225.77545 C 464.85808,-225.77545 468.35967,-227.24768 471.33605,-230.19385 C 474.16198,-232.9303 475.57549,-236.37091 475.57549,-240.52033 C 475.57549,-244.63837 474.13903,-248.13379 471.26781,-251.00501 C 468.39714,-253.87568 464.9179,-255.31159 460.82952,-255.31159 C 456.74112,-255.31158 453.28314,-253.86841 450.45776,-250.98267 z M 458.21225,-242.27948 C 457.76196,-243.26117 457.08795,-243.75232 456.18903,-243.75232 C 454.59986,-243.75232 453.80558,-242.68225 453.80558,-240.54321 C 453.80558,-238.40368 454.59986,-237.33471 456.18903,-237.33471 C 457.23841,-237.33471 457.98795,-237.85546 458.43769,-238.89922 L 460.64045,-237.72625 C 459.59052,-235.86077 458.01536,-234.92779 455.91496,-234.92779 C 454.29506,-234.92779 452.99733,-235.42449 452.0229,-236.4168 C 451.0468,-237.41021 450.56016,-238.77953 450.56016,-240.52532 C 450.56016,-242.24035 451.06245,-243.60186 452.06764,-244.61034 C 453.07283,-245.61888 454.32466,-246.12291 455.82545,-246.12291 C 458.04557,-246.12291 459.63526,-245.24803 460.59626,-243.50005 L 458.21225,-242.27948 z M 468.57562,-242.27948 C 468.12475,-243.26117 467.46417,-243.75232 466.5932,-243.75232 C 464.97217,-243.75232 464.16107,-242.68225 464.16107,-240.54321 C 464.16107,-238.40368 464.97217,-237.33471 466.5932,-237.33471 C 467.64429,-237.33471 468.38037,-237.85546 468.80048,-238.89922 L 471.05249,-237.72625 C 470.00421,-235.86077 468.43127,-234.92779 466.33478,-234.92779 C 464.7171,-234.92779 463.42218,-235.42449 462.44831,-236.4168 C 461.47614,-237.41021 460.98896,-238.77953 460.98896,-240.52532 C 460.98896,-242.24035 461.48341,-243.60186 462.47181,-244.61034 C 463.45966,-245.61888 464.71711,-246.12291 466.24531,-246.12291 C 468.4615,-246.12291 470.04896,-245.24803 471.0066,-243.50005 L 468.57562,-242.27948 z" />
            </g>
          </g>
          <g>
            <circle cx="255.55124" cy="15.31348" r="10.80664" fill="#ffffff" />
            <path
              d="M 258.67819,12.18701 C 258.67819,11.77051 258.3403,11.4331 257.92526,11.4331 L 253.15182,11.4331 C 252.73678,11.4331 252.39889,11.7705 252.39889,12.18701 L 252.39889,16.95996 L 253.72994,16.95996 L 253.72994,22.61182 L 257.34713,22.61182 L 257.34713,16.95996 L 258.67818,16.95996 L 258.67818,12.18701 L 258.67819,12.18701 z"
              fill="#000000"
            />
            <circle cx="255.53854" cy="9.1723604" r="1.63281" fill="#000000" />
            <path
              clipRule="evenodd"
              d="M 255.5239,3.40723 C 252.29148,3.40723 249.55515,4.53516 247.31589,6.79102 C 245.01804,9.12452 243.8696,11.88672 243.8696,15.07569 C 243.8696,18.26466 245.01804,21.00733 247.31589,23.30225 C 249.61374,25.59668 252.35007,26.74414 255.5239,26.74414 C 258.73679,26.74414 261.52195,25.58789 263.87742,23.27295 C 266.09715,21.07568 267.2075,18.34326 267.2075,15.07568 C 267.2075,11.8081 266.07762,9.04687 263.8198,6.79101 C 261.56003,4.53516 258.79538,3.40723 255.5239,3.40723 z M 255.55319,5.50684 C 258.20163,5.50684 260.45065,6.44092 262.30026,8.30811 C 264.1694,10.15528 265.10397,12.41114 265.10397,15.07569 C 265.10397,17.75928 264.18893,19.98633 262.35885,21.75587 C 260.43014,23.66212 258.16256,24.61476 255.55319,24.61476 C 252.94284,24.61476 250.69381,23.67189 248.80612,21.78517 C 246.91647,19.89845 245.97311,17.66212 245.97311,15.0757 C 245.97311,12.48879 246.92721,10.23341 248.83541,8.30812 C 250.6655,6.44092 252.90475,5.50684 255.55319,5.50684 z"
              fill="#000000"
              fillRule="evenodd"
            />
          </g>
        </g>
      </svg>
    </a>
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
        <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.078.53 9 9 0 0 0-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.123 0 0 0 .014 1.017 9 9 0 0 0 .05.727 7.946 7.946 0 0 0 .077.53h-.005a3.334 3.334 0 0 0 .113.438c.245.743.65 1.303 1.214 1.68.565.376 1.256.564 2.075.564.8 0 1.536-.213 2.105-.603.57-.39.94-.916 1.175-1.65.076-.235.135-.558.177-.93a10.9 10.9 0 0 0 .043-1.207v-.82c0-.095-.047-.142-.14-.142h-3.064c-.094 0-.14.047-.14.141v.956c0 .094.046.14.14.14h1.666c.056 0 .084.03.084.086 0 .36 0 .62-.036.865-.038.244-.1.447-.147.606-.108.385-.348.664-.638.876-.29.212-.738.35-1.227.35-.545 0-.901-.15-1.21-.353-.306-.203-.517-.454-.67-.915a3.136 3.136 0 0 1-.147-.762 17.366 17.367 0 0 1-.034-.656c-.01-.26-.014-.572-.014-.939a26.401 26.403 0 0 1 .014-.938 15.821 15.822 0 0 1 .035-.656 3.19 3.19 0 0 1 .148-.76 1.89 1.89 0 0 1 .742-1.01c.344-.244.593-.352 1.137-.352.508 0 .815.096 1.144.303.33.207.528.492.764.925.047.094.111.118.198.07l1.044-.43c.075-.048.09-.115.042-.199a3.549 3.549 0 0 0-.466-.742 3 3 0 0 0-.679-.607 3.313 3.313 0 0 0-.903-.41A4.068 4.068 0 0 0 19.586 0zM8.217 5.836c-1.69 0-3.036.086-4.297.086-1.146 0-2.291 0-3.007-.029v.831l1.088.2c.744.144 1.174.488 1.174 2.264v11.288c0 1.777-.43 2.12-1.174 2.263l-1.088.2v.832c.773-.029 2.12-.086 3.465-.086 1.29 0 2.951.057 3.667.086v-.831l-1.49-.2c-.773-.115-1.174-.487-1.174-2.264v-4.784c.688.057 1.29.057 2.206.057 1.748 3.123 3.41 5.472 4.355 6.56.86 1.032 2.177 1.691 3.839 1.691.487 0 1.003-.086 1.318-.23v-.744c-1.031 0-2.063-.716-2.808-1.518-1.26-1.376-2.95-3.582-4.355-6.074 2.32-.545 4.04-2.722 4.04-4.9 0-3.208-2.492-4.698-5.758-4.698zm-.515 1.29c2.406 0 3.839 1.26 3.839 3.552 0 2.263-1.547 3.782-4.097 3.782-.974 0-1.404-.03-2.063-.086v-7.19c.66-.059 1.547-.059 2.32-.059z" />
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
    coreJournals: [
      { name: t("journals.ss.title"), href: "/journals/social-sciences-humanities" },
      { name: t("journals.bio.title"), href: "/journals/biology" },
      { name: t("journals.chem.title"), href: "/journals/chemistry" },
      { name: t("journals.med.title"), href: "/journals/medicine" },
      { name: t("journals.ds.title"), href: "/journals/data-science" },
      { name: t("journals.eng.title"), href: "/journals/engineering" },
      { name: t("journals.env.title"), href: "/journals/environmental-science" },
    ],
    frontiersJournals: [
      { name: t("journals.clinical-ai.title"), href: "/journals/clinical-ai-digital-health" },
      { name: t("journals.ai-safety.title"), href: "/journals/ai-safety-governance" },
      { name: t("journals.decarbonization.title"), href: "/journals/decarbonization-carbon-tech" },
      { name: t("journals.quantum-engineering.title"), href: "/journals/quantum-engineering" },
      { name: t("journals.synthetic-biology.title"), href: "/journals/synthetic-biology-bio-design" },
      { name: t("journals.space-resources.title"), href: "/journals/space-resources-orbital-economy" },
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
              <div className="flex h-24 w-[320px] max-w-full shrink-0 items-center">
                <LogoSO variant="lockup" className="h-full w-auto object-contain" />
              </div>
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

          {/* Core Series */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Core Series</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.coreJournals.map((link) => (
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

          {/* Emerging Frontiers */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Emerging Frontiers</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.frontiersJournals.map((link) => (
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">{t("footer.forAuthors")}</h3>
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

          {/* About & Policies */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">{t("footer.aboutUs")}</h3>
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mt-8">{t("footer.policies")}</h3>
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-white/60">
              <p>
                &copy; {new Date().getFullYear()} {t("footer.copyright")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-white/60 text-xs">
              <CcByLogo />
              <span>{t("footer.ccbyStatement")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
