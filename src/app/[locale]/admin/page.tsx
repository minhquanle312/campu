import { headers } from 'next/headers'
import { ArrowUpRight, LayoutDashboard, Plus } from 'lucide-react'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { Link, redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { AdminActionCard } from './_components/admin-action-card'
import { adminOverviewModules } from './admin-modules'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const user = session?.user ?? null

  if (!user || !ADMIN_USER_EMAIL.includes(user.email)) {
    redirect({ locale, href: '/' })
  }

  const moduleCount = adminOverviewModules.length
  const adminName = user?.name ?? user?.email ?? 'Admin'

  return (
    <main className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
        <Card className="border-slate-200/80 bg-white/90 shadow-sm">
          <CardHeader className="space-y-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
              Admin overview
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back, {adminName}
              </CardTitle>
              <CardDescription className="max-w-3xl text-sm leading-6 text-slate-500">
                This overview is the working surface for the current admin area.
                The sidebar handles primary navigation, while this page keeps
                the most useful context, shortcuts, and module summaries in one
                place.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 border-t border-slate-200/70 pt-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Active modules
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {moduleCount}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Shared admin modules are available through the sidebar and
                summarized below.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Workspace pattern
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                Shell-first layout
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Use the left sidebar to switch sections and keep this screen for
                orientation and next steps.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Scope guardrails
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                Private admin routes only
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Operational work stays inside the admin route family without
                sending editors back into the public app.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 shadow-sm">
          <CardHeader className="space-y-3">
            <div>
              <CardTitle className="text-lg text-slate-900">
                Today&apos;s starting points
              </CardTitle>
              <CardDescription className="mt-1 leading-6 text-slate-500">
                Keep the overview focused on actions that unblock daily admin
                work, then use the sidebar for broader navigation.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              className="w-full justify-between rounded-full px-5"
            >
              <Link href="/admin/trips/new">
                <span className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Create a new trip
                </span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Recommended flow
              </p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                <li>Start urgent content updates from the shortcut above.</li>
                <li>Review module summaries before drilling into a section.</li>
                <li>Use the sidebar as the single navigation map for admin.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900">
              Module snapshots
            </h2>
            <p className="text-sm leading-6 text-slate-500">
              Each card reflects the centralized admin module registry so this
              overview stays in sync with the sidebar structure.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {adminOverviewModules.map(section => (
            <AdminActionCard key={section.href} {...section} />
          ))}
        </div>
      </section>
    </main>
  )
}
