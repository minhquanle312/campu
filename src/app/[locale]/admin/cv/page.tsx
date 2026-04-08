import { headers } from 'next/headers'
import { FilePenLine } from 'lucide-react'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import CVModel from '@/models/CV'
import {} from '@/components/ui/card'
import { redirect } from '@/i18n/navigation'
import { emptyCVData } from '@/types/cv'

import { AdminPageShell } from '../_components/admin-page-shell'
import CVEditForm from '../../cv/edit/cv-edit-form'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminCVPage({ params }: Props) {
  const { locale } = await params
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (
    !session ||
    !session.user ||
    !ADMIN_USER_EMAIL.includes(session.user.email)
  ) {
    redirect({ locale, href: '/' })
  }

  await dbConnect()
  const cvDoc = (await CVModel.findOne({}).lean()) || emptyCVData
  const cvData = JSON.parse(JSON.stringify(cvDoc))

  return (
    <AdminPageShell
      badgeLabel="Admin module"
      title="CV editor"
      description="Update bilingual profile content from the private admin workspace while preserving the shared editor workflow and current API contract."
      icon={FilePenLine}
      sectionTitle="Editor workspace"
      sectionDescription="Continue using the shared CV editor below so this admin route stays visually aligned with the shell without forking the implementation."
      stats={[
        {
          label: 'Editing scope',
          title: 'Structured CV content management',
          description:
            'Keep résumé updates inside the editor flow instead of forcing the module into a list or table layout.',
        },
        {
          label: 'Workflow',
          title: 'Reuses the shared CV form',
          description:
            'The existing editor stays responsible for sections, arrays, and save behavior so this wrapper only aligns the shell presentation.',
        },
      ]}
    >
      <CVEditForm initialData={cvData} />
    </AdminPageShell>
  )
}
