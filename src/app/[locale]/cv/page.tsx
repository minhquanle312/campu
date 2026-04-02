import { getTranslations } from 'next-intl/server'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { CVPageShell } from '@/components/cv/cv-page-shell'
import { getSession } from '@/lib/auth-server'
import dbConnect from '@/lib/mongodb'
import CVModel from '@/models/CV'
import { emptyCVData, type CVData } from '@/types/cv'

export default async function CVPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'vi' }>
}) {
  const { locale } = await params
  const t = await getTranslations('CV')
  const session = await getSession()
  const isAdmin = Boolean(
    session?.user?.email && ADMIN_USER_EMAIL.includes(session.user.email),
  )

  await dbConnect()
  const cvDoc =
    ((await CVModel.findOne({}).lean()) as CVData | null) || emptyCVData

  const cv = JSON.parse(JSON.stringify(cvDoc)) as CVData

  return (
    <CVPageShell
      cv={cv}
      isAdmin={isAdmin}
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
