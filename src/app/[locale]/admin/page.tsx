import { headers } from 'next/headers'
import {
  FileText,
  LayoutDashboard,
  MapIcon,
  Plus,
  Settings2,
} from 'lucide-react'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link } from '@/i18n/navigation'

import { AdminActionCard } from './_components/admin-action-card'

type Props = {
  params: Promise<{ locale: string }>
}

const adminSections = [
  {
    title: 'Site settings',
    description:
      'Update homepage, CV, and AI assistant configuration from the existing settings workflow.',
    href: '/settings',
    ctaLabel: 'Open settings',
    icon: Settings2,
    eyebrow: 'Global controls',
  },
  {
    title: 'CV editor',
    description:
      'Edit bilingual CV content and keep the public CV page in sync with the latest profile updates.',
    href: '/cv/edit',
    ctaLabel: 'Edit CV',
    icon: FileText,
    eyebrow: 'Profile content',
  },
  {
    title: 'Journey management',
    description:
      'Create new trips now, then continue using the journey map and trip detail pages for item-level edits.',
    href: '/journey/add',
    ctaLabel: 'Add trip',
    icon: MapIcon,
    eyebrow: 'Travel data',
  },
] as const

export default async function AdminPage({ params }: Props) {
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
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
          <Card className="border-slate-200/80 bg-white/90 shadow-sm">
            <CardHeader className="space-y-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
                Admin hub
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                  Central place for Campu admin actions
                </CardTitle>
                <CardDescription className="max-w-3xl text-sm leading-6 text-slate-500">
                  Start here when you need to update site-wide content, manage
                  CV details, or continue growing future data-control tools
                  without scattering admin entry points across the app.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">
                Quick actions
              </CardTitle>
              <CardDescription className="leading-6 text-slate-500">
                Minimal today, ready to expand with summaries and moderation
                workflows later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-center rounded-full">
                <Link href="/journey/add">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add a new trip
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-center rounded-full"
              >
                <Link href="/settings">Open site settings</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminSections.map(section => (
            <AdminActionCard key={section.href} {...section} />
          ))}
        </section>
      </div>
    </main>
  )
}
