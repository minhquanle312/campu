import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import localFont from 'next/font/local'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { HeaderNav } from '@/components/header-nav'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'
import { generateSiteMetadata } from '@/lib/metadata'
import { StructuredData } from '@/components/structured-data'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return generateSiteMetadata({
    locale,
    path: `/${locale}`,
  })
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const t = await getTranslations()

  return (
    <html lang={locale}>
      <head>
        <StructuredData type="website" locale={locale} />
        <StructuredData type="person" locale={locale} />
      </head>
      <GoogleAnalytics gaId="G-4G1HZ52BL0" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <NextIntlClientProvider>
          <div className="min-h-screen bg-linear-to-b from-rose-50 to-white">
            <div className="bg-amber-500 text-black/90 px-4 py-2 text-center text-sm font-medium">
              ⚠️ {t('DevelopmentWarning')}
            </div>
            <HeaderNav />
            {children}
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
