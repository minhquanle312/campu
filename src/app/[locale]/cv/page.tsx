import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CVPageShell } from '@/components/cv/cv-page-shell'
import { generateSiteMetadata } from '@/lib/metadata'
import dbConnect from '@/lib/mongodb'
import CVModel from '@/models/CV'
import { emptyCVData, type CVData } from '@/types/cv'
import { routing } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: 'en' | 'vi' }>
}

const cvMetadataByLocale = {
  en: {
    title: 'CV',
    description:
      "Explore Cẩm Pu's bilingual CV, including experience, education, skills, and contact details.",
  },
  vi: {
    title: 'CV',
    description:
      'Xem CV song ngữ của Cẩm Pu với kinh nghiệm, học vấn, kỹ năng và thông tin liên hệ.',
  },
} as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const metadata = cvMetadataByLocale[locale]

  return generateSiteMetadata({
    title: metadata.title,
    description: metadata.description,
    locale,
    path: `/${locale}/cv`,
  })
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function CVPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('CV')

  await dbConnect()
  const cvDoc =
    ((await CVModel.findOne({}).lean()) as CVData | null) || emptyCVData

  const cv = JSON.parse(JSON.stringify(cvDoc)) as CVData

  return (
    <CVPageShell
      cv={cv}
      locale={locale}
      messages={{
        contact: t('Contact'),
        skills: t('Skills'),
        education: t('Education'),
        experience: t('Experience'),
        downloadPdf: t('DownloadPDF'),
        information: t('Information'),
        summary: t('Summary'),
        objective: t('Objective'),
        fullLayout: t('FullLayout'),
        minimalLayout: t('MinimalLayout'),
        hrAssistant: t('HRAssistant'),
        hrAssistantDescription: t('HRAssistantDescription'),
      }}
    />
  )
}
