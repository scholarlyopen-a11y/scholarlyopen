import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/language-context'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const sourceSerif = Source_Serif_4({ 
  subsets: ["latin"],
  variable: '--font-serif'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://scholarlyopen.org'),
  title: 'Scholarly Open | Open Access Scholarly Publishing',
  description: 'Scholarly Open is an international open-access publisher committed to advancing research across Biology, Chemistry, Medicine, Data Science, Engineering, Environmental Science, and Social Sciences with FAIR-aligned open access.',
  generator: 'v0.app',
  keywords: ['open access', 'academic publishing', 'peer review', 'international', 'DOAJ', 'COPE', 'CrossRef', 'DOI', 'scholarly publishing', 'Scholarly Open'],
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    shortcut: '/icon.svg',
    apple: {
      url: '/apple-icon.png',
      sizes: '180x180',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} ${sourceSerif.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
