import { routing } from '@/i18n/routing'
import HomePage from './_components/home'
import { setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <HomePage />
}
