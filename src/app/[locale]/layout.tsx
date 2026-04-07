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
import { LayoutVisibility } from '@/components/layout-visibility'
import { InterviewChatWidget } from '@/components/interview-chat-widget'
import { PendingPublishBanner } from '@/components/pending-publish-banner'
import { TooltipProvider } from '@/components/ui/tooltip'

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
  const assistantTitle = t('CV.HRAssistant')
  const assistantDescription = t('CV.HRAssistantDescription')

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
        <TooltipProvider>
          <NextIntlClientProvider>
            <div className="min-h-screen bg-linear-to-b from-rose-50 to-white print:bg-none">
              <PendingPublishBanner />
              <LayoutVisibility
                banner={
                  <div
                    data-testid="shell-banner"
                    className="border-b border-amber-300/70 bg-amber-100/90 px-4 py-2 text-center text-sm font-medium text-amber-950 backdrop-blur print:hidden"
                  >
                    {t('DevelopmentWarning')}
                  </div>
                }
                header={
                  <div data-testid="shell-header" className="print:hidden">
                    <HeaderNav />
                  </div>
                }
                footer={
                  <div data-testid="shell-footer" className="print:hidden">
                    <Footer />
                  </div>
                }
              >
                {children}
                <InterviewChatWidget
                  locale={locale}
                  title={assistantTitle}
                  description={assistantDescription}
                />
              </LayoutVisibility>
            </div>
          </NextIntlClientProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
