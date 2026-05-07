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
  title: 'PeerRex | Open Access Scholarly Publishing',
  description: 'PeerRex is an international open-access publisher dedicated to advancing knowledge in Social Sciences, Archaeology, and Medical research through rigorous peer review and open scholarship. DOAJ compliant, COPE member.',
  generator: 'v0.app',
  keywords: ['open access', 'academic publishing', 'peer review', 'social sciences', 'archaeology', 'medical journals', 'international', 'DOAJ', 'COPE', 'CrossRef', 'DOI', 'scholarly publishing', 'PeerRex'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'PeerRex | Open Access Scholarly Publishing',
    description: 'International open-access publisher committed to advancing knowledge through rigorous peer review. DOAJ compliant, COPE member.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'de_DE',
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
