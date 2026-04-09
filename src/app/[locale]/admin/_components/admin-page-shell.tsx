import type { LucideIcon } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type AdminPageShellStat = {
  label: string
  title: string
  description: string
}

type AdminPageShellProps = {
  badgeLabel: string
  title: string
  description: string
  icon: LucideIcon
  sectionTitle: string
  sectionDescription: string
  children: React.ReactNode
  stats?: AdminPageShellStat[]
}

export function AdminPageShell({
  badgeLabel,
  title,
  description,
  icon: Icon,
  sectionTitle,
  sectionDescription,
  children,
  stats,
}: AdminPageShellProps) {
  return (
    <main className="space-y-8">
      <Card className="border-slate-200/80 bg-white/90 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {badgeLabel}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </CardTitle>
            <CardDescription className="max-w-3xl text-sm leading-6 text-slate-500">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        {stats?.length ? (
          <CardContent
            className={`grid gap-3 border-t border-slate-200/70 pt-6 ${stats.length > 1 ? 'sm:grid-cols-2' : ''}`}
          >
            {stats.map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4"
              >
                <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  {stat.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {stat.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {stat.description}
                </p>
              </div>
            ))}
          </CardContent>
        ) : null}
      </Card>

      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">
            {sectionTitle}
          </h2>
          <p className="text-sm leading-6 text-slate-500">
            {sectionDescription}
          </p>
        </div>

        {children}
      </section>
    </main>
  )
}
