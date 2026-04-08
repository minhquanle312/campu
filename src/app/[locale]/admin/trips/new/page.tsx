import { headers } from 'next/headers'
import { MapIcon } from 'lucide-react'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'
import { AdminPageShell } from '../../_components/admin-page-shell'
import { AddTripForm } from '../../../journey/add/_components/add-trip-form'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminNewTripPage({ params }: Props) {
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

  return (
    <AdminPageShell
      badgeLabel="Trips module"
      title="Create trip"
      description="Add a new trip inside the Trips admin module so creation stays in the same workspace and navigation context as the trip table."
      icon={MapIcon}
      sectionTitle="Trip creation workspace"
      sectionDescription="Use the shared trip form below to create a record without adding a second navigation layer inside admin."
    >
      <AddTripForm />
    </AdminPageShell>
  )
}
