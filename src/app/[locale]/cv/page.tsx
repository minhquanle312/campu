import { getTranslations } from 'next-intl/server'
import dbConnect from '@/lib/mongodb'
import CVModel from '@/models/CV'
import { CVPageShell } from '@/components/cv/cv-page-shell'
import { emptyCVData, type CVData } from '@/types/cv'

export default async function CVPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'vi' }>
}) {
  const { locale } = await params
  const t = await getTranslations('CV')

  await dbConnect()
  const cvDoc =
    ((await CVModel.findOne({}).lean()) as CVData | null) || emptyCVData

  const cv = cvDoc

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
        currentLayout: t('CurrentLayout'),
        simpleLayout: t('SimpleLayout'),
        interviewAssistant: t('InterviewAssistant'),
        interviewAssistantDescription: t('InterviewAssistantDescription'),
      }}
    />
  )
}
