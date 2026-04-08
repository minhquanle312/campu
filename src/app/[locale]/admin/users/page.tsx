import { headers } from 'next/headers'
import { Plus, UserRoundPen, Users } from 'lucide-react'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { Link, redirect } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Props = {
  params: Promise<{ locale: string }>
}

type UserListItem = {
  _id: { toString: () => string }
  name?: string
  email?: string
  avatar_url?: string
}

export default async function AdminUsersPage({ params }: Props) {
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
  const users = (await User.find({})
    .sort({ createdAt: -1 })
    .lean()) as UserListItem[]

  return (
    <main className="space-y-6">
      <Card className="border-slate-200/80 bg-white/90 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            Admin module
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Users management
            </CardTitle>
            <CardDescription className="max-w-3xl text-sm leading-6 text-slate-500">
              Manage user profiles with the current schema fields only: name,
              email, and avatar URL.
            </CardDescription>
          </div>
          <div>
            <Button asChild className="rounded-full">
              <Link href="/admin/users/create">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create user
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-slate-200/80 bg-white/90 shadow-sm">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-6 py-4">Name</TableHead>
              <TableHead className="px-6 py-4">Email</TableHead>
              <TableHead className="px-6 py-4">Avatar URL</TableHead>
              <TableHead className="px-6 py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => {
              const id = user._id.toString()

              return (
                <TableRow key={id}>
                  <TableCell className="px-6 py-4 font-medium whitespace-normal text-slate-900">
                    {user.name || 'Unnamed user'}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-normal text-slate-600">
                    {user.email || 'No email'}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-normal break-all text-slate-500">
                    {user.avatar_url || 'No avatar URL'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href={`/admin/users/${id}/edit`}>
                        <UserRoundPen className="h-4 w-4" aria-hidden="true" />
                        Edit user
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </main>
  )
}
