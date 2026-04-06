import dbConnect from '@/lib/mongodb'
import GeneralConfigModel from '@/models/GeneralConfig'
import {
  resolveGeneralConfig,
  type GeneralConfig,
} from '@/types/general-config'
import { routing } from '@/i18n/routing'
import HomePage from './_components/home'
import { setRequestLocale } from 'next-intl/server'
import { generateSiteMetadata } from '@/lib/metadata'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  return generateSiteMetadata({
    title: locale === 'vi' ? 'Trang chủ' : 'Home',
    locale,
    path: `/${locale}`,
  })
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  await dbConnect()
  const configDoc = await GeneralConfigModel.findOne({}).lean()
  const generalConfig = resolveGeneralConfig(
    JSON.parse(
      JSON.stringify(configDoc ?? null),
    ) as Partial<GeneralConfig> | null,
  )

  return (
    <HomePage
      locale={locale}
      initialConfig={generalConfig}
      primaryImage={generalConfig.homepage.primaryImage}
      secondaryImage={generalConfig.homepage.secondaryImage}
    />
  )
}
