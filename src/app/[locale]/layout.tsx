import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import localFont from 'next/font/local'
import './globals.css'
import { MainNav } from '@/components/main-nav'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'

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

export const metadata: Metadata = {
  title: 'Cẩm Pu',
  description:
    'A little corner of the world for Cẩm Pu - lovingly crafted by Minh Quân Lê',
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

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <NextIntlClientProvider>
          <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
            <MainNav />
            <main className="container mx-auto px-6 my-7">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
