import { headers } from 'next/headers'
import { Users } from 'lucide-react'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import { redirect } from '@/i18n/navigation'
import { AdminPageShell } from '../../_components/admin-page-shell'
import { UserForm } from '../_components/user-form'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminCreateUserPage({ params }: Props) {
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
      badgeLabel="Users module"
      title="Create user"
      description="Add a user profile from within the Users admin module while keeping the route visually aligned with the shared shell and centralized sidebar context."
      icon={Users}
      sectionTitle="User creation workspace"
      sectionDescription="The shared user form stays intact below so this page does not add a competing local navigation pattern."
    >
      <UserForm mode="create" />
    </AdminPageShell>
  )
}
