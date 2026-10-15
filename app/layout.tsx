import type { Metadata } from 'next'
import { Inter, Source_Serif_4, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/language-context'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-jakarta'
});

const sourceSerif = Source_Serif_4({ 
  subsets: ["latin"],
  variable: '--font-serif'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.scholarlyopen.org'),
  title: 'Scholarly Open | Open Access Scholarly Publishing',
  description: 'Scholarly Open is an international open-access publisher committed to advancing research across Biology, Chemistry, Medicine, Data Science, Engineering & Applied Sciences, Environmental Science, and Social Sciences & Humanities with FAIR-aligned open access.',
  alternates: {
    canonical: 'https://www.scholarlyopen.org',
  },
  generator: 'v0.app',
  keywords: ['open access', 'academic publishing', 'peer review', 'international', 'DOAJ', 'COPE', 'CrossRef', 'DOI', 'scholarly publishing', 'Scholarly Open'],
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon.png',
        type: 'image/png',
      },
    ],
    shortcut: '/icon.svg',
    apple: {
      url: '/apple-icon.png',
      type: 'image/png',
    },
  },
  openGraph: {
    title: 'Scholarly Open | Open Access Scholarly Publishing',
    description: 'International open-access publisher committed to FAIR research dissemination, rigorous peer review, and global scholarly impact.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'de_DE',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Scholarly Open',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scholarly Open | Open Access Scholarly Publishing',
    description: 'International open-access publisher committed to FAIR research dissemination, rigorous peer review, and global scholarly impact.',
    images: ['/og-image.svg'],
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Scholarly Open",
  "alternateName": "Scholarly Open Publishing",
  "url": "https://www.scholarlyopen.org",
  "logo": "https://www.scholarlyopen.org/icon.svg",
  "description": "Scholarly Open is an independent Gold Open Access academic publishing and research training platform adhering to the Principles of Transparency and Best Practice in Scholarly Publishing.",
  "sameAs": [
    "https://de.linkedin.com/company/scholarlyopen"
  ],
  "publishingPrinciples": "https://www.scholarlyopen.org/publication-ethics",
  "knowsAbout": [
    "Open Access Publishing",
    "Peer Review",
    "Scientific Integrity",
    "FAIR Data Principles",
    "Academic Research Training"
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${sourceSerif.variable} ${plusJakarta.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
