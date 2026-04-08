import { notFound } from 'next/navigation'
import mongoose from 'mongoose'
import { headers } from 'next/headers'
import { Users } from 'lucide-react'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { redirect } from '@/i18n/navigation'
import { AdminPageShell } from '../../../_components/admin-page-shell'
import { UserForm } from '../../_components/user-form'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

type UserDocument = {
  _id: { toString: () => string }
  name?: string
  email?: string
  avatar_url?: string
}

export default async function AdminEditUserPage({ params }: Props) {
  const { locale, id } = await params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound()
  }

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
  const user = (await User.findById(id).lean()) as UserDocument | null

  if (!user) {
    notFound()
  }

  return (
    <AdminPageShell
      badgeLabel="Users module"
      title="Edit user"
      description="Update this profile from inside the Users admin module so edit flows keep the same shell framing and parent-module orientation as the users table."
      icon={Users}
      sectionTitle="User editing workspace"
      sectionDescription="Continue using the shared user form below so this route stays within the Users module context without a second navigation layer."
    >
      <UserForm
        mode="edit"
        userId={user._id.toString()}
        initialValues={{
          name: user.name || '',
          email: user.email || '',
          avatar_url: user.avatar_url || '',
        }}
      />
    </AdminPageShell>
  )
}
