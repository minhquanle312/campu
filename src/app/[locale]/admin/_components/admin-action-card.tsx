import type { LucideIcon } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type AdminActionCardProps = {
  title: string
  description: string
  href: string
  ctaLabel: string
  icon: LucideIcon
  eyebrow?: string
}

export function AdminActionCard({
  title,
  description,
  href,
  ctaLabel,
  icon: Icon,
  eyebrow,
}: AdminActionCardProps) {
  return (
    <Card className="h-full border-slate-200/80 bg-white/90 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            {eyebrow ? (
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                {eyebrow}
              </p>
            ) : null}
            <div className="space-y-1">
              <CardTitle className="text-xl text-slate-900">{title}</CardTitle>
              <CardDescription className="leading-6 text-slate-500">
                {description}
              </CardDescription>
            </div>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-600">
          Keep this area as the single place to reach admin-only data controls
          as more editing workflows are added.
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="rounded-full px-5">
          <Link href={href}>{ctaLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
