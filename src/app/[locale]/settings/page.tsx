import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import GeneralConfigModel from '@/models/GeneralConfig'
import {
  emptyGeneralConfig,
  resolveGeneralConfig,
} from '@/types/general-config'
import SettingsForm from './settings-form'

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (
    !session ||
    !session.user ||
    !ADMIN_USER_EMAIL.includes(session.user.email)
  ) {
    redirect('/')
  }

  await dbConnect()
  const configDoc = await GeneralConfigModel.findOne({}).lean()
  const initialConfig = configDoc
    ? resolveGeneralConfig(JSON.parse(JSON.stringify(configDoc)))
    : emptyGeneralConfig

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Site Settings
          </h1>
          <p className="text-sm text-slate-500">
            Manage global homepage, CV, and AI assistant configuration.
          </p>
        </div>

        <SettingsForm initialConfig={initialConfig} />
      </div>
    </main>
  )
}
