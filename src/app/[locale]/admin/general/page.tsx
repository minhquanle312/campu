import { headers } from 'next/headers'
import { Settings2 } from 'lucide-react'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import GeneralConfigModel from '@/models/GeneralConfig'
import {} from '@/components/ui/card'
import { redirect } from '@/i18n/navigation'
import {
  emptyGeneralConfig,
  resolveGeneralConfig,
} from '@/types/general-config'

import { AdminPageShell } from '../_components/admin-page-shell'
import SettingsForm from '../../settings/settings-form'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminGeneralPage({ params }: Props) {
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
  const configDoc = await GeneralConfigModel.findOne({}).lean()
  const initialConfig = configDoc
    ? resolveGeneralConfig(JSON.parse(JSON.stringify(configDoc)))
    : emptyGeneralConfig

  return (
    <AdminPageShell
      badgeLabel="Admin module"
      title="General settings"
      description="Manage shared site configuration from the private admin workspace while keeping the existing settings workflow and publish behavior intact."
      icon={Settings2}
      sectionTitle="Configuration workspace"
      sectionDescription="Use the shared form below to update admin-managed settings without branching into a separate implementation for this route."
      stats={[
        {
          label: 'Editing scope',
          title: 'Homepage, CV, and assistant controls',
          description:
            'This page stays focused on configuration work instead of list or table management.',
        },
        {
          label: 'Workflow',
          title: 'Reuses the shared settings form',
          description:
            'The underlying editor remains unchanged so admin updates continue to follow the same save and publish path.',
        },
      ]}
    >
      <SettingsForm initialConfig={initialConfig} />
    </AdminPageShell>
  )
}
